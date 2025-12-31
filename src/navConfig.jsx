import React from 'react';
import { Icon } from '@rsuite/icons';
import { TbBuildingStore } from "react-icons/tb";
import { VscTable } from 'react-icons/vsc';
import { MdDashboard, } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import OthersIcon from '@rsuite/icons/Others';
import AdvancedAnalyticsIcon from '@rsuite/icons/AdvancedAnalytics';
import EventDetailIcon from '@rsuite/icons/EventDetail';
import LocationIcon from '@rsuite/icons/Location';


export const superAdminNavs = [
  {
    eventKey: 'dashboard',
    icon: <Icon as={MdDashboard} />,
    title: 'Dashboard',
    to: '/dashboard'
  },
  {
    eventKey: 'user-management',
    icon: <Icon as={FaUserAlt} />,
    title: 'User Management',
    to: '/manage-user'
  },
  {
    eventKey: 'leads-conversion',
    icon: <Icon as={OthersIcon} />,
    title: 'Leads & Conversion',
    to: '',
    children: [
      {
        eventKey: 'Leads',
        title: 'Leads',
        to: '/leads',
        icon: <Icon as={EventDetailIcon} />,

      },
      {
        eventKey: 'conversion',
        title: 'Conversions',
        to: '/conversion',
        icon: <Icon as={AdvancedAnalyticsIcon} />,

      },

    ]

  },
]

export const adminNavs = [
  {
    eventKey: 'venue',
    icon: <Icon as={VscTable} />,
    title: 'Venue',
    to: '/venue',
    children: [
      {
        eventKey: 'venue',
        title: 'Venue List',
        to: '/venue'
      },
      {
        eventKey: 'venue-category',
        title: 'Venue Category',
        to: '/venue-category'
      },
      {
        eventKey: 'venue-page',
        title: 'Venue Page',
        to: '/venue-page'
      }
    ]
  },
  {
    eventKey: 'vendor',
    icon: <Icon as={TbBuildingStore} />,
    title: 'Vendor',
    to: '/vendor',
    children: [
      {
        eventKey: 'vendor',
        title: 'Vendor List',
        to: '/vendor'
      },
      {
        eventKey: 'vendor-category',
        title: 'Vendor Category',
        to: '/vendor-category'
      },
      {
        eventKey: 'vendor-page',
        title: 'Vendor Page',
        to: '/vendor-page'
      }
    ]
  },
  {
    eventKey: 'location',
    icon: <Icon as={LocationIcon} />,
    title: 'Location',
    to: '/location',
    children: [
      {
        eventKey: 'city',
        title: 'City',
        to: '/location/city'
      },
      {
        eventKey: 'location',
        title: 'Locality',
        to: '/location/locality'
      },


    ]

  },

]

export const salesNavs = [

  {
    eventKey: 'dashboard',
    icon: <Icon as={MdDashboard} />,
    title: 'Dashboard',
    to: '/dashboard'
  },
  {
    eventKey: 'assinged-leads',
    icon: <Icon as={MdDashboard} />,
    title: 'Assigned Leads',
    to: '/assigned-leads'
  },
]
