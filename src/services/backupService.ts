/**
 * ============================================================================
 * JEEVAN JYOTI FOUNDATION - FIRESTORE DATA BACKUP SERVICE
 * दानदाता, स्वयंसेवक, जारी प्रमाण पत्र एवं संस्थागत डेटा बैकअप सर्विस
 * ============================================================================
 */

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, isMockFirebase } from '../lib/firebase';
import { DONORS_DATA } from '../data/donorsData';
import { INITIAL_VOLUNTEERS, INITIAL_TASKS } from '../data/taskData';
import {
  getAllRegisteredCertificates,
  syncCertificatesFromFirestore,
  RegisteredCertificateItem
} from './certificateRegistryService';
import { DonationRecord, Volunteer } from '../types';
import { logAdminActivity } from './adminService';

export interface FirestoreBackupSummary {
  totalDonations: number;
  totalDonationAmountInr: number;
  totalVolunteers: number;
  totalTasksCompletedByVolunteers: number;
  totalIssuedCertificates: number;
  donationsWithPanCount: number;
}

export interface FirestoreBackupPayload {
  metadata: {
    exportDate: string;
    organization: string;
    exportedBy: {
      name: string;
      uid: string;
      role: string;
    };
    version: string;
    summary: FirestoreBackupSummary;
    checksumSha256?: string;
  };
  summary: FirestoreBackupSummary;
  donations: DonationRecord[];
  volunteers: Volunteer[];
  certificates: RegisteredCertificateItem[];
  tasks?: any[];
  siteSettings?: any;
}

export interface AdminBackupOperator {
  name: string;
  uid: string;
  role: string;
}

/**
 * Generate a SHA-256 hash string for checksum integrity
 */
async function generateSha256Checksum(content: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback to simple hash if subtle crypto fails
  }

  // Fallback hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fallback-' + Math.abs(hash).toString(16).padStart(16, '0') + '-' + Date.now().toString(16);
}

/**
 * Compile all donations, volunteers, and certificates into a unified backup payload
 */
export async function compileDonationsAndVolunteersBackup(
  adminInfo: AdminBackupOperator
): Promise<FirestoreBackupPayload> {
  // 1. Gather Donations (Merge LocalStorage + Seed Data + Firestore if available)
  let localDonations: DonationRecord[] = [];
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jjf_user_donations');
      if (stored) {
        localDonations = JSON.parse(stored);
      }
    }
  } catch {
    // Ignore error
  }

  let firestoreDonations: DonationRecord[] = [];
  if (!isMockFirebase && db) {
    try {
      const donationsCol = collection(db, 'donations');
      const snap = await getDocs(donationsCol);
      if (!snap.empty) {
        firestoreDonations = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DonationRecord));
      }
    } catch {
      // Benign fallback
    }
  }

  const donationsMap = new Map<string, DonationRecord>();
  [...DONORS_DATA, ...localDonations, ...firestoreDonations].forEach((don) => {
    if (don && don.id) {
      donationsMap.set(don.id, don);
    }
  });
  const allDonations = Array.from(donationsMap.values());

  // 2. Gather Volunteers
  let localVolunteers: Volunteer[] = [];
  try {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem('jjf_volunteers');
      if (storedVol) {
        localVolunteers = JSON.parse(storedVol);
      }
    }
  } catch {
    // Ignore error
  }

  const volunteersMap = new Map<string, Volunteer>();
  [...INITIAL_VOLUNTEERS, ...localVolunteers].forEach((vol) => {
    if (vol && vol.id) {
      volunteersMap.set(vol.id, vol);
    }
  });
  const allVolunteers = Array.from(volunteersMap.values());

  // 3. Gather Certificates
  let allCertificates: RegisteredCertificateItem[] = [];
  try {
    allCertificates = await syncCertificatesFromFirestore();
  } catch {
    allCertificates = getAllRegisteredCertificates();
  }

  // 4. Site Settings from Firestore
  let siteSettings: any = null;
  if (!isMockFirebase && db) {
    try {
      const settingsSnap = await getDoc(doc(db, 'site_content', 'home_page'));
      if (settingsSnap.exists()) {
        siteSettings = settingsSnap.data();
      }
    } catch {
      // Ignore
    }
  }

  // 5. Calculate Metrics
  const totalDonations = allDonations.length;
  const totalDonationAmountInr = allDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalVolunteers = allVolunteers.length;
  const totalTasksCompletedByVolunteers = INITIAL_TASKS.reduce(
    (sum, t) => sum + (t.status === 'completed' ? 1 : 0),
    0
  );
  const totalIssuedCertificates = allCertificates.length;
  const donationsWithPanCount = allDonations.filter(
    (d) => d.panNumber && String(d.panNumber).trim().length === 10
  ).length;

  const summary: FirestoreBackupSummary = {
    totalDonations,
    totalDonationAmountInr,
    totalVolunteers,
    totalTasksCompletedByVolunteers,
    totalIssuedCertificates,
    donationsWithPanCount
  };

  const payloadSansHash: FirestoreBackupPayload = {
    metadata: {
      exportDate: new Date().toISOString(),
      organization: 'जीवन ज्योति फाउंडेशन (JEEVAN JYOTI FOUNDATION, GHAZIPUR)',
      exportedBy: {
        name: adminInfo.name || 'सिस्टम व्यवस्थापक',
        uid: adminInfo.uid || 'admin',
        role: adminInfo.role || 'Admin'
      },
      version: '2.0.0-PROD',
      summary
    },
    summary,
    donations: allDonations,
    volunteers: allVolunteers,
    certificates: allCertificates,
    tasks: INITIAL_TASKS,
    siteSettings
  };

  // Generate SHA-256 Checksum of the serialised payload
  const serialized = JSON.stringify(payloadSansHash);
  const checksumSha256 = await generateSha256Checksum(serialized);

  payloadSansHash.metadata.checksumSha256 = checksumSha256;

  return payloadSansHash;
}

/**
 * Triggers browser download of the JSON payload
 */
export function downloadBackupJsonFile(payload: FirestoreBackupPayload, fileName?: string): void {
  const actualFileName =
    fileName ||
    `JJF_Firestore_Backup_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = actualFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);

  // Store metadata in localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('jjf_last_backup_timestamp', new Date().toISOString());
      localStorage.setItem(
        'jjf_last_backup_meta',
        JSON.stringify({
          fileName: actualFileName,
          totalDonations: payload.summary.totalDonations,
          totalVolunteers: payload.summary.totalVolunteers
        })
      );
    } catch {
      // Ignore
    }
  }
}

/**
 * Execute full backup flow: compile, download, and log admin activity
 */
export async function executeManualDatabaseBackup(
  adminInfo: AdminBackupOperator
): Promise<{
  payload: FirestoreBackupPayload;
  fileName: string;
  summary: FirestoreBackupSummary;
}> {
  const payload = await compileDonationsAndVolunteersBackup(adminInfo);
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `JJF_Firestore_Backup_${dateStr}.json`;

  downloadBackupJsonFile(payload, fileName);

  // Log to Admin Audit Log
  try {
    await logAdminActivity({
      adminUid: adminInfo.uid,
      adminName: adminInfo.name,
      action: 'export_database_backup',
      details: `फायरस्टोर डेटाबेस बैकअप डाउनलोड: ${payload.summary.totalDonations} दान रिकॉर्ड, ${payload.summary.totalVolunteers} स्वयंसेवक, ${payload.summary.totalIssuedCertificates} प्रमाण पत्र (${fileName})`
    });
  } catch {
    // Non-blocking log failure
  }

  return {
    payload,
    fileName,
    summary: payload.summary
  };
}
