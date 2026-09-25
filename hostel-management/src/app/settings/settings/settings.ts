import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

  hostelName = 'Hostel Management';
  hostelAddress = '';
  hostelPhone = '';
  hostelEmail = '';

  emailNotifications = true;
  complaintNotifications = true;
  feeNotifications = true;
  visitorNotifications = true;

  compactMode = false;

  constructor() {
    this.loadSettings();
    this.applyCompactMode();
  }

  saveSettings(): void {

    const settings = {
      hostelName: this.hostelName,
      hostelAddress: this.hostelAddress,
      hostelPhone: this.hostelPhone,
      hostelEmail: this.hostelEmail,
      emailNotifications: this.emailNotifications,
      complaintNotifications: this.complaintNotifications,
      feeNotifications: this.feeNotifications,
      visitorNotifications: this.visitorNotifications,
      compactMode: this.compactMode
    };

    localStorage.setItem(
      'hostelSettings',
      JSON.stringify(settings)
    );

    this.applyCompactMode();

    alert('Settings saved successfully.');
  }

  loadSettings(): void {

    const savedSettings =
      localStorage.getItem('hostelSettings');

    if (!savedSettings) {
      return;
    }

    try {

      const settings =
        JSON.parse(savedSettings);

      this.hostelName =
        settings.hostelName ??
        this.hostelName;

      this.hostelAddress =
        settings.hostelAddress ??
        this.hostelAddress;

      this.hostelPhone =
        settings.hostelPhone ??
        this.hostelPhone;

      this.hostelEmail =
        settings.hostelEmail ??
        this.hostelEmail;

      this.emailNotifications =
        settings.emailNotifications ??
        this.emailNotifications;

      this.complaintNotifications =
        settings.complaintNotifications ??
        this.complaintNotifications;

      this.feeNotifications =
        settings.feeNotifications ??
        this.feeNotifications;

      this.visitorNotifications =
        settings.visitorNotifications ??
        this.visitorNotifications;

      this.compactMode =
        settings.compactMode ??
        this.compactMode;

    } catch (error) {

      console.error(
        'Unable to load saved settings:',
        error
      );

    }
  }

  applyCompactMode(): void {

    if (this.compactMode) {

      document.body.classList.add(
        'compact-mode'
      );

    } else {

      document.body.classList.remove(
        'compact-mode'
      );

    }
  }

}