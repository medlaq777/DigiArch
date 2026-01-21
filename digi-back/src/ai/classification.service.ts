import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassificationService {
  generatePath(metadata: any): string {
    // Sanitization helper
    const sanitize = (str: string) => (str || 'unknown').replace(/[^a-zA-Z0-9-_]/g, '_');

    const nom = sanitize(metadata.nom);
    const prenom = sanitize(metadata.prenom);
    const dept = sanitize(metadata.departement);
    
    // Structure: /nom_prenom/departement
    // Note: Filename itself will be handled by the caller or appended here
    return `${nom}_${prenom}/${dept}`;
  }
}
