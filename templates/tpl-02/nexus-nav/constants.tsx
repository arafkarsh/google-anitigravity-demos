import React from 'react';
import { MenuItemType } from './types';
import { 
  Home, Settings, Users, BarChart2, Briefcase, 
  Calendar, FileText, Mail, Map, Layers, 
  Shield, CreditCard, HelpCircle, Database, Server
} from 'lucide-react';

export const APP_NAME = "Nexus Suite";

// A deep, extensive menu structure to demonstrate overflow and recursion
export const MENU_ITEMS: MenuItemType[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home size={16} />,
    children: [
      { id: 'dash-analytics', label: 'Analytics' },
      { id: 'dash-crm', label: 'CRM Overview' },
      { id: 'dash-ecommerce', label: 'E-commerce' },
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Briefcase size={16} />,
    children: [
      { 
        id: 'active-projects', 
        label: 'Active',
        children: [
            { id: 'proj-alpha', label: 'Project Alpha' },
            { id: 'proj-beta', label: 'Project Beta' },
            { 
                id: 'proj-gamma', 
                label: 'Project Gamma',
                children: [
                    { id: 'gamma-frontend', label: 'Frontend' },
                    { id: 'gamma-backend', label: 'Backend' }
                ]
            },
        ]
      },
      { id: 'archived-projects', label: 'Archived' },
      { id: 'timeline', label: 'Timeline View' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <BarChart2 size={16} />,
    children: [
      { id: 'rep-financial', label: 'Financial' },
      { id: 'rep-sales', label: 'Sales & Growth' },
      { id: 'rep-audit', label: 'Audit Logs' },
    ]
  },
  {
    id: 'team',
    label: 'Team',
    icon: <Users size={16} />,
    children: [
      { id: 'team-dir', label: 'Directory' },
      { id: 'team-org', label: 'Org Chart' },
      { id: 'team-hiring', label: 'Hiring' },
    ]
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: <Calendar size={16} />,
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FileText size={16} />,
    children: [
        { id: 'doc-invoices', label: 'Invoices' },
        { id: 'doc-contracts', label: 'Contracts' },
    ]
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <Mail size={16} />,
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: <Server size={16} />,
    children: [
        { id: 'inf-aws', label: 'AWS Status' },
        { id: 'inf-azure', label: 'Azure Status' },
        { id: 'inf-logs', label: 'System Logs' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Layers size={16} />,
    children: [
        { id: 'mkt-campaigns', label: 'Campaigns' },
        { id: 'mkt-social', label: 'Social Media' },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: <CreditCard size={16} />,
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: <Map size={16} />,
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield size={16} />,
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: <Database size={16} />,
  },
  {
    id: 'help',
    label: 'Support',
    icon: <HelpCircle size={16} />,
    children: [
        { id: 'help-docs', label: 'Documentation' },
        { id: 'help-ticket', label: 'Submit Ticket' },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={16} />,
  }
];
