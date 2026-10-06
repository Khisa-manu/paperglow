import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/index';
import { dbService } from './dbService';

// Ensure storage directory exists
if (!fs.existsSync(config.storage.dir)) {
  fs.mkdirSync(config.storage.dir, { recursive: true });
}

export interface StoreDocumentParams {
  organizationId: number | string;
  userId?: number | string | null;
  category: 'invoice' | 'receipt' | 'membership_certificate' | 'digital_id_card' | 'legal_doc' | 'clinic_doc' | 'school_report' | 'artwork' | 'other';
  title: string;
  originalName: string;
  mimeType: string;
  fileBuffer: Buffer;
  entityType?: string;
  entityId?: number | string;
  metadata?: Record<string, any>;
}

export const storageService = {
  /**
   * Save file to disk abstraction and record metadata in database
   */
  async storeDocument(params: StoreDocumentParams) {
    const fileUuid = crypto.randomUUID();
    const ext = path.extname(params.originalName) || '.bin';
    const safeFileName = `${params.category}-${fileUuid}${ext}`;
    const targetPath = path.join(config.storage.dir, safeFileName);

    // Write file to filesystem
    await fs.promises.writeFile(targetPath, params.fileBuffer);

    // Save record to documents table
    const docRecord = await dbService.create('documents', {
      uuid: fileUuid,
      organization_id: params.organizationId,
      uploaded_by_user_id: params.userId || null,
      category: params.category,
      title: params.title,
      file_name: safeFileName,
      original_name: params.originalName,
      mime_type: params.mimeType,
      file_size_bytes: params.fileBuffer.length,
      storage_path: targetPath,
      entity_type: params.entityType || null,
      entity_id: params.entityId || null,
      metadata_json: params.metadata ? JSON.stringify(params.metadata) : null,
    });

    return docRecord;
  },

  /**
   * Get file path by document ID
   */
  async getDocumentPath(id: number | string, organizationId: number | string): Promise<{ path: string; mimeType: string; originalName: string } | null> {
    const doc = await dbService.findById('documents', id, organizationId);
    if (!doc || !fs.existsSync(doc.storage_path)) {
      return null;
    }
    return {
      path: doc.storage_path,
      mimeType: doc.mime_type,
      originalName: doc.original_name,
    };
  },

  /**
   * Delete document and file
   */
  async deleteDocument(id: number | string, organizationId: number | string): Promise<boolean> {
    const doc = await dbService.findById('documents', id, organizationId);
    if (!doc) return false;

    if (fs.existsSync(doc.storage_path)) {
      try {
        await fs.promises.unlink(doc.storage_path);
      } catch (e) {
        console.warn('[StorageService] Error unlinking file:', e);
      }
    }

    return dbService.delete('documents', id, organizationId);
  },
};
