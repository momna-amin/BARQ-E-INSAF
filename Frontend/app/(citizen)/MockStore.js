import { useState, useEffect } from 'react';

let listeners = [];

function notify() {
  listeners.forEach(listener => listener());
}

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

export function useMockStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    return subscribe(() => setTick(t => t + 1));
  }, []);
}

export const userData = {
  name: 'Ahmed Khan',
  email: 'ahmed.khan@email.com',
  phone: '03123456789',
  cnic: '42101-1234567-8',
  district: 'Hyderabad',
  role: 'Citizen',
  joinedDate: 'January 2025',
  dp: 'AK',
};

export const updateProfile = (newData) => {
  Object.assign(userData, newData);
  notify();
};

export const lawyers = [
  { 
    id: '1',
    initials: 'SR', 
    name: 'Sara Raza',  
    spec: 'Property Law', 
    color: '#5C1A1A',
    location: 'Karachi',
    rating: '4.9',
    cases: 42,
    experience: '12 years',
    education: 'University of Karachi',
    sbc: 'SBC-4421',
    about: 'Specializing in property disputes, land acquisition, and real estate litigation.',
    district: 'Karachi',
    successfulCasesCount: 42,
    schedule: [
      { day: 'Monday', time: '02:00 PM - 05:00 PM' },
      { day: 'Wednesday', time: '02:00 PM - 05:00 PM' }
    ],
    reviews: [
      { user: 'Kamil Shah', rating: '5.0', comment: 'Extremely professional and knowledgeable about Karachi land laws.' },
      { user: 'Maria B.', rating: '4.8', comment: 'Helped us resolve our commercial property boundary conflict efficiently.' }
    ]
  },
  { 
    id: '2',
    initials: 'MK', 
    name: 'M. Karim',   
    spec: 'Family Law', 
    color: '#0F2744',
    location: 'Hyderabad',
    rating: '4.7',
    cases: 31,
    experience: '8 years',
    education: 'Sindh Law College',
    sbc: 'SBC-2389',
    about: 'Expert in family matters including divorce, custody, and maintenance cases in Hyderabad.',
    district: 'Hyderabad',
    successfulCasesCount: 31,
    schedule: [
      { day: 'Tuesday', time: '03:00 PM - 06:00 PM' },
      { day: 'Thursday', time: '03:00 PM - 06:00 PM' }
    ],
    reviews: [
      { user: 'Siddique Ali', rating: '4.5', comment: 'Very supportive and handled our child custody arrangement with care.' }
    ]
  },
  { 
    id: '3',
    initials: 'FA', 
    name: 'Fatima A.',  
    spec: 'Family Law', 
    color: '#1B4332',
    location: 'Sukkur',
    rating: '4.8',
    cases: 28,
    experience: '10 years',
    education: 'Lahore University of Law',
    sbc: 'SBC-5671',
    about: 'Handles family dispute resolution, alimony, and child custody matters.',
    district: 'Sukkur',
    successfulCasesCount: 28,
    schedule: [
      { day: 'Monday', time: '01:00 PM - 04:00 PM' },
      { day: 'Friday', time: '09:00 AM - 12:00 PM' }
    ],
    reviews: [
      { user: 'Nadia Khan', rating: '5.0', comment: 'A reliable guide during divorce proceedings. Highly recommended.' }
    ]
  },
  { 
    id: '4',
    initials: 'ZH', 
    name: 'Z. Hassan',  
    spec: 'Property Law', 
    color: '#4a148c',
    location: 'Larkana',
    rating: '4.6',
    cases: 19,
    experience: '6 years',
    education: 'University of Sindh',
    sbc: 'SBC-8912',
    about: 'Specializes in inheritance partition, wills, and agricultural land litigation.',
    district: 'Larkana',
    successfulCasesCount: 19,
    schedule: [
      { day: 'Wednesday', time: '10:00 AM - 01:00 PM' },
      { day: 'Saturday', time: '11:00 AM - 02:00 PM' }
    ],
    reviews: [
      { user: 'Asghar Memon', rating: '4.7', comment: 'Helped resolve land inheritance claims in Larkana district.' }
    ]
  },
];

export const activeCases = [
  { 
    id: '1',
    title: 'Property Dispute - Hyderabad', 
    type: 'Property',
    filingDate: '15 January 2025',
    lastUpdated: '2 hours ago',
    status: 'Active',  
    description: 'Dispute regarding land ownership in Hyderabad. The plaintiff claims ownership of a commercial property in the central district.',
    evidence: ['Property Document.pdf', 'Incident Video.mp4', 'Witness Statement.pdf'],
  },
  { 
    id: '2',
    title: 'Inheritance Claim - Karachi',  
    type: 'Family',
    filingDate: '28 January 2025',
    lastUpdated: '1 day ago',
    status: 'Pending', 
    description: 'Inheritance dispute over ancestral property in Karachi. Multiple heirs are contesting the distribution of assets.',
    evidence: ['Family Tree Document.pdf'],
  },
];

export const addCase = (newCase) => {
  activeCases.unshift({
    id: String(activeCases.length + 1),
    filingDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    lastUpdated: 'Just now',
    status: 'Pending',
    evidence: [],
    ...newCase
  });
  notify();
};

export const updateCase = (id, updatedFields) => {
  const cIndex = activeCases.findIndex(c => c.id === id);
  if (cIndex !== -1) {
    activeCases[cIndex] = {
      ...activeCases[cIndex],
      ...updatedFields,
      lastUpdated: 'Just now'
    };
    notify();
  }
};

export const addEvidenceToCase = (caseId, file) => {
  const c = activeCases.find(c => c.id === caseId);
  if (c) {
    c.evidence.push(file);
    c.lastUpdated = 'Just now';
    notify();
  }
};

export const removeEvidenceFromCase = (caseId, index) => {
  const c = activeCases.find(c => c.id === caseId);
  if (c && c.evidence[index] !== undefined) {
    c.evidence.splice(index, 1);
    c.lastUpdated = 'Just now';
    notify();
  }
};