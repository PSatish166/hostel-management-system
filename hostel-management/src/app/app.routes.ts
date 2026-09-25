import { Routes } from '@angular/router';

import { Login } from './login/login';

import { authGuard } from './services/auth-guard';
import { adminGuard } from './services/admin-guard';

import { Dashboard } from './dashboard/dashboard';

import { Students } from './students/students';
import { AddStudent } from './students/add-student/add-student';
import { EditStudent } from './students/edit-student/edit-student';

import { Rooms } from './rooms/rooms/rooms';
import { AddRoom } from './rooms/add-room/add-room';
import { EditRoom } from './rooms/edit-room/edit-room';

import { Allocation } from './allocation/allocation/allocation';
import { AddAllocation } from './allocation/add-allocation/add-allocation';
import { EditAllocation } from './allocation/edit-allocation/edit-allocation';

import { Fees } from './fees/fees';
import { AddFee } from './fees/add-fee/add-fee';
import { EditFee } from './fees/edit-fee/edit-fee';

import { Complaints } from './complaints/complaints/complaints';
import { AddComplaint } from './complaints/add-complaint/add-complaint';
import { EditComplaint } from './complaints/edit-complaint/edit-complaint';

import { Attendance } from './attendance/attendance/attendance';
import { AddAttendance } from './attendance/add-attendance/add-attendance';
import { EditAttendance } from './attendance/edit-attendance/edit-attendance';

import { Visitors } from './visitors/visitors/visitors';
import { AddVisitor } from './visitors/add-visitor/add-visitor';
import { EditVisitor } from './visitors/edit-visitor/edit-visitor';

import { Reports } from './reports/reports/reports';

import { Settings } from './settings/settings/settings';


export const routes: Routes = [

  // ==============================
  // LOGIN
  // Public
  // ==============================

  {
    path: 'login',
    component: Login
  },


  // ==============================
  // DASHBOARD
  // ADMIN + USER
  // ==============================

  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard]
  },


  // ==============================
  // STUDENTS
  // ==============================

  // View Students
  // ADMIN + USER
  {
    path: 'students',
    component: Students,
    canActivate: [authGuard]
  },

  // Add Student
  // ADMIN only
  {
    path: 'students/add',
    component: AddStudent,
    canActivate: [authGuard, adminGuard]
  },

  // Edit Student
  // ADMIN only
  {
    path: 'students/edit/:id',
    component: EditStudent,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // ROOMS
  // ==============================

  // View Rooms
  // ADMIN + USER
  {
    path: 'rooms',
    component: Rooms,
    canActivate: [authGuard]
  },

  // Add Room
  // ADMIN only
  {
    path: 'rooms/add',
    component: AddRoom,
    canActivate: [authGuard, adminGuard]
  },

  // Edit Room
  // ADMIN only
  {
    path: 'rooms/edit/:id',
    component: EditRoom,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // ALLOCATION
  // ==============================

  // View Allocation
  // ADMIN + USER
  {
    path: 'allocation',
    component: Allocation,
    canActivate: [authGuard]
  },

  // Add Allocation
  // ADMIN only
  {
    path: 'allocation/add',
    component: AddAllocation,
    canActivate: [authGuard, adminGuard]
  },

  // Edit Allocation
  // ADMIN only
  {
    path: 'allocation/edit/:id',
    component: EditAllocation,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // FEES
  // ==============================

  // View Fees
  // ADMIN + USER
  {
    path: 'fees',
    component: Fees,
    canActivate: [authGuard]
  },

  // Add Fee
  // ADMIN only
  {
    path: 'fees/add',
    component: AddFee,
    canActivate: [authGuard, adminGuard]
  },

  // Edit Fee
  // ADMIN only
  {
    path: 'fees/edit/:id',
    component: EditFee,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // COMPLAINTS
  // ==============================

  // View Complaints
  // ADMIN + USER
  {
    path: 'complaints',
    component: Complaints,
    canActivate: [authGuard]
  },

  // Add Complaint
  // ADMIN + USER
  {
    path: 'complaints/add',
    component: AddComplaint,
    canActivate: [authGuard]
  },

  // Edit Complaint
  // ADMIN only
  {
    path: 'complaints/edit/:id',
    component: EditComplaint,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // ATTENDANCE
  // ==============================

  // View Attendance
  // ADMIN + USER
  {
    path: 'attendance',
    component: Attendance,
    canActivate: [authGuard]
  },

  // Add Attendance
  // ADMIN only
  {
    path: 'attendance/add',
    component: AddAttendance,
    canActivate: [authGuard, adminGuard]
  },

  // Edit Attendance
  // ADMIN only
  {
    path: 'attendance/edit/:id',
    component: EditAttendance,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // VISITORS
  // ==============================

  // View Visitors
  // ADMIN + USER
  {
    path: 'visitors',
    component: Visitors,
    canActivate: [authGuard]
  },

  // Add Visitor
  // ADMIN only
  {
    path: 'visitors/add',
    component: AddVisitor,
    canActivate: [authGuard, adminGuard]
  },

  // Edit Visitor
  // ADMIN only
  {
    path: 'visitors/edit/:id',
    component: EditVisitor,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // REPORTS
  // ADMIN only
  // ==============================

  {
    path: 'reports',
    component: Reports,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // SETTINGS
  // ADMIN only
  // ==============================

  {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard, adminGuard]
  },


  // ==============================
  // UNKNOWN URL
  // ==============================

  {
    path: '**',
    redirectTo: ''
  }

];