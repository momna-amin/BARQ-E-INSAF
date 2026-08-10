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

export const lawyerProfile = {
  id: 'lawyer-1',
  name: 'Sara Raza',
  spec: 'Property Law',
  rating: '4.9',
  sbc: 'SBC-4421',
  successfulCasesCount: 42,
  district: 'Karachi',
  experience: '12 years',
  education: 'University of Karachi',
  about: 'Specializing in property disputes, land acquisition, and real estate litigation.',
  isAvailable: true,
  address: 'Office 204, Gulsher Heights, Gulshan-e-Iqbal, Karachi',
  email: 'sara.raza@email.com',
  phone: '+92 333 1234567',
  initials: 'SR',
  color: '#0F2744',
  dp: null,
};

export const otherLawyers = [
  {
    id: 'lawyer-2',
    name: 'M. Karim',
    spec: 'Family Law',
    rating: '4.7',
    sbc: 'SBC-2389',
    successfulCasesCount: 31,
    district: 'Hyderabad',
    experience: '8 years',
    education: 'Sindh Law College',
    about: 'Expert in family matters including divorce, custody, and maintenance cases.',
    isAvailable: true,
    address: 'Office 12, Hira Center, Hyderabad',
    email: 'm.karim@email.com',
    phone: '+92 333 9876543',
    initials: 'MK',
    color: '#1B4332',
    dp: null,
    reviews: [
      { clientName: 'Ahmed Raza', rating: 5, comment: 'Excellent family lawyer', date: '2 weeks ago' },
      { clientName: 'Zara Memon', rating: 4, comment: 'Good communication', date: '1 month ago' }
    ]
  },
  {
    id: 'lawyer-3',
    name: 'Fatima A.',
    spec: 'Civil Cases',
    rating: '4.8',
    sbc: 'SBC-5671',
    successfulCasesCount: 28,
    district: 'Sukkur',
    experience: '10 years',
    education: 'Lahore University of Law',
    about: 'Handles civil litigation, contract disputes, and property rights cases.',
    isAvailable: false,
    address: 'Office 5, Civil Lines, Sukkur',
    email: 'fatima.a@email.com',
    phone: '+92 333 4567890',
    initials: 'FA',
    color: '#4a148c',
    dp: null,
    reviews: [
      { clientName: 'Bilal Khan', rating: 5, comment: 'Very professional', date: '3 weeks ago' }
    ]
  }
];

export const updateLawyerProfile = (newData) => {
  Object.assign(lawyerProfile, newData);
  notify();
};

export const timingSlots = [
  { id: '1', day: 'Monday', time: '02:00 PM - 05:00 PM' },
  { id: '2', day: 'Wednesday', time: '02:00 PM - 05:00 PM' },
  { id: '3', day: 'Friday', time: '10:00 AM - 01:00 PM' },
];

export const addTimingSlot = (day, time) => {
  timingSlots.push({
    id: String(Date.now()),
    day,
    time
  });
  notify();
};

export const deleteTimingSlot = (id) => {
  const idx = timingSlots.findIndex(s => s.id === id);
  if (idx !== -1) {
    timingSlots.splice(idx, 1);
    notify();
  }
};

export const editTimingSlot = (id, day, time) => {
  const idx = timingSlots.findIndex(s => s.id === id);
  if (idx !== -1) {
    timingSlots[idx] = { id, day, time };
    notify();
  }
};

export const caseRequests = [
  { 
    id: '1', 
    name: 'Ahmed K.', 
    spec: 'Property Dispute', 
    location: 'Hyderabad', 
    time: '2 hours ago', 
    desc: 'Boundary wall dispute with neighbour commercial land. The neighbour has constructed a wall that encroaches on my property line.',
    contact: '+92 312 3456789',
    evidence: ['Land deed.pdf', 'Photos.zip'],
    problemStatement: 'Property boundary dispute with neighbor'
  },
  { 
    id: '2', 
    name: 'Zara M.', 
    spec: 'Family Case', 
    location: 'Karachi', 
    time: '5 hours ago', 
    desc: 'Seeking child custody legal consultation. Going through divorce and need custody of my 5-year-old daughter.',
    contact: '+92 300 9876543',
    evidence: ['Marriage cert.pdf'],
    problemStatement: 'Child custody dispute'
  },
  { 
    id: '3', 
    name: 'Bilal S.', 
    spec: 'Property Dispute', 
    location: 'Sukkur', 
    time: '1 day ago', 
    desc: 'Siblings division of inherited home. My siblings are disputing the distribution of our late father\'s property.',
    contact: '+92 333 1122334',
    evidence: ['Will copy.pdf'],
    problemStatement: 'Inheritance distribution dispute'
  },
];

export const activeCases = [
  { 
    id: '1', 
    title: 'Raza vs. Malik', 
    clientName: 'Ahmed Raza', 
    court: 'Civil Court Karachi', 
    description: 'Property transfer claim. Client claims ownership of commercial property in central Karachi.',
    contact: '+92 321 4455667',
    evidence: ['Deed_Transfer.pdf', 'Map.png'],
    problemStatement: 'Property transfer dispute'
  },
  { 
    id: '2', 
    title: 'Khan Divorce Settlement', 
    clientName: 'Bilal Khan', 
    court: 'Family Court Karachi', 
    description: 'Mutual separation terms. Client seeking amicable divorce with fair settlement.',
    contact: '+92 345 8899001',
    evidence: ['SeparationAgreement.pdf'],
    problemStatement: 'Divorce settlement'
  },
];

export const declineRequest = (id) => {
  const idx = caseRequests.findIndex(r => r.id === id);
  if (idx !== -1) {
    caseRequests.splice(idx, 1);
    notify();
  }
};

export const acceptRequest = (id) => {
  const req = caseRequests.find(r => r.id === id);
  if (req) {
    activeCases.unshift({
      id: String(activeCases.length + 1),
      title: `${req.name} - ${req.spec}`,
      clientName: req.name,
      court: req.spec.includes('Property') ? 'Civil Court Karachi' : 'Family Court Karachi',
      description: req.desc,
      contact: req.contact,
      evidence: req.evidence,
      problemStatement: req.problemStatement || req.desc.substring(0, 50) + '...',
    });
    declineRequest(id);
  }
};