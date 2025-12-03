import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, Clock, Users, FileText, BookOpen, Shield, Check, X, ChevronRight, Home, Camera, Mic, Edit3, Trash2, Share2 } from 'lucide-react';

export default function SafeCircleApp() {
  const [currentView, setCurrentView] = useState('home');
  const [checkInActive, setCheckInActive] = useState(false);
  const [checkInTimer, setCheckInTimer] = useState(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '555-0101', primary: true },
    { id: 2, name: 'Best Friend', phone: '555-0102', primary: false }
  ]);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [newIncident, setNewIncident] = useState({ title: '', description: '', severity: 'low' });

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const incidentsData = await window.storage.get('incidents');
      if (incidentsData) {
        setIncidents(JSON.parse(incidentsData.value));
      }
      
      const contactsData = await window.storage.get('contacts');
      if (contactsData) {
        setContacts(JSON.parse(contactsData.value));
      }
    } catch (error) {
      console.log('First time loading, using defaults');
    }
  };

  const saveIncidents = async (updatedIncidents) => {
    try {
      await window.storage.set('incidents', JSON.stringify(updatedIncidents));
      setIncidents(updatedIncidents);
    } catch (error) {
      console.error('Error saving incidents:', error);
    }
  };

  const saveContacts = async (updatedContacts) => {
    try {
      await window.storage.set('contacts', JSON.stringify(updatedContacts));
      setContacts(updatedContacts);
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  };

  const startCheckIn = (minutes) => {
    setCheckInActive(true);
    setCheckInTimer(minutes);
    setTimeout(() => {
      if (checkInActive) {
        alert('Check-in timer expired! Notifying your safety contacts.');
      }
    }, minutes * 60000);
  };

  const cancelCheckIn = () => {
    setCheckInActive(false);
    setCheckInTimer(null);
  };

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    if (!locationSharing) {
      setTimeout(() => setLocationSharing(false), 3600000); // Auto-stop after 1 hour
    }
  };

  const addIncident = () => {
    if (newIncident.title.trim()) {
      const incident = {
        id: Date.now(),
        ...newIncident,
        timestamp: new Date().toISOString(),
        location: 'Current Location'
      };
      saveIncidents([incident, ...incidents]);
      setNewIncident({ title: '', description: '', severity: 'low' });
      setShowIncidentForm(false);
    }
  };

  const deleteIncident = (id) => {
    saveIncidents(incidents.filter(i => i.id !== id));
  };

  // Home Dashboard View
  const HomeView = () => (
    <div className="space-y-4">
      {/* Emergency Actions */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <h2 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Emergency Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-red-600 text-white rounded-lg p-4 font-semibold hover:bg-red-700 transition flex flex-col items-center gap-2">
            <Phone className="w-6 h-6" />
            Call 911
          </button>
          <button className="bg-orange-600 text-white rounded-lg p-4 font-semibold hover:bg-orange-700 transition flex flex-col items-center gap-2">
            <Phone className="w-6 h-6" />
            Fake Call
          </button>
        </div>
      </div>

      {/* Quick Status */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
        <h2 className="text-lg font-bold text-green-900 mb-3">Quick Status</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-green-600 text-white rounded-lg p-3 font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            I'm Okay
          </button>
          <button className="bg-yellow-600 text-white rounded-lg p-3 font-semibold hover:bg-yellow-700 transition flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Need Help
          </button>
        </div>
      </div>

      {/* Check-In Timer */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
        <h2 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Safety Check-In
        </h2>
        {checkInActive ? (
          <div className="space-y-3">
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-800">Active check-in</p>
              <p className="text-2xl font-bold text-blue-900">{checkInTimer} min</p>
            </div>
            <button 
              onClick={cancelCheckIn}
              className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition"
            >
              Cancel Check-In
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => startCheckIn(15)}
              className="bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition text-sm"
            >
              15 min
            </button>
            <button 
              onClick={() => startCheckIn(30)}
              className="bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition text-sm"
            >
              30 min
            </button>
            <button 
              onClick={() => startCheckIn(60)}
              className="bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition text-sm"
            >
              60 min
            </button>
          </div>
        )}
      </div>

      {/* Location Sharing */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
        <h2 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Sharing
        </h2>
        <button 
          onClick={toggleLocationSharing}
          className={`w-full rounded-lg p-3 font-semibold transition ${
            locationSharing 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {locationSharing ? 'Sharing Location (Stop)' : 'Share Location Now'}
        </button>
        {locationSharing && (
          <p className="text-xs text-purple-700 mt-2 text-center">
            Sharing with safety contacts • Auto-stops in 1 hour
          </p>
        )}
      </div>
    </div>
  );

  // Incidents View
  const IncidentsView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Incident Log</h2>
        <button 
          onClick={() => setShowIncidentForm(!showIncidentForm)}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition text-sm"
        >
          {showIncidentForm ? 'Cancel' : '+ New Incident'}
        </button>
      </div>

      {showIncidentForm && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Incident title"
            value={newIncident.title}
            onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
          <textarea
            placeholder="Description (optional)"
            value={newIncident.description}
            onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none h-24 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setNewIncident({...newIncident, severity: 'low'})}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                newIncident.severity === 'low' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Low Risk
            </button>
            <button
              onClick={() => setNewIncident({...newIncident, severity: 'medium'})}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                newIncident.severity === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setNewIncident({...newIncident, severity: 'high'})}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                newIncident.severity === 'high' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              High Risk
            </button>
          </div>
          <button 
            onClick={addIncident}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition"
          >
            Save Incident
          </button>
        </div>
      )}

      <div className="space-y-3">
        {incidents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No incidents logged yet</p>
            <p className="text-sm">Tap "+ New Incident" to document an event</p>
          </div>
        ) : (
          incidents.map(incident => (
            <div key={incident.id} className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{incident.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(incident.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                    incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {incident.severity}
                  </span>
                  <button 
                    onClick={() => deleteIncident(incident.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {incident.description && (
                <p className="text-sm text-gray-700 mb-2">{incident.description}</p>
              )}
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {incident.location}
              </p>
            </div>
          ))
        )}
      </div>

      {incidents.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">Pattern Insights</h3>
          <p className="text-sm text-blue-800">
            You've logged {incidents.length} incident{incidents.length !== 1 ? 's' : ''}.
            {incidents.filter(i => i.severity === 'high').length > 0 && 
              ` ${incidents.filter(i => i.severity === 'high').length} marked as high risk.`
            }
          </p>
        </div>
      )}
    </div>
  );

  // Contacts View
  const ContactsView = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Safety Contacts</h2>
      
      <div className="space-y-3">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.phone}</p>
              {contact.primary && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                  Primary Contact
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition">
                <Phone className="w-4 h-4" />
              </button>
              <button className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition">
        + Add Contact
      </button>

      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-2">How It Works</h3>
        <p className="text-sm text-gray-700">
          Your safety contacts will be notified when you trigger an alert, miss a check-in, 
          or share your location. They won't receive any information unless you activate a feature.
        </p>
      </div>
    </div>
  );

  // Resources View
  const ResourcesView = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Safety Resources</h2>
      
      <div className="space-y-3">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <h3 className="font-bold text-red-900 mb-3">Emergency Services</h3>
          <div className="space-y-2">
            <button className="w-full bg-red-600 text-white rounded-lg p-3 font-semibold hover:bg-red-700 transition flex items-center justify-between">
              <span>Emergency (911)</span>
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
          <h3 className="font-bold text-purple-900 mb-3">Crisis Hotlines</h3>
          <div className="space-y-2">
            {[
              { name: 'National Suicide Prevention', number: '988' },
              { name: 'Domestic Violence Hotline', number: '1-800-799-7233' },
              { name: 'RAINN Sexual Assault', number: '1-800-656-4673' },
              { name: 'Crisis Text Line', number: 'Text HOME to 741741' }
            ].map((resource, idx) => (
              <button key={idx} className="w-full bg-white border-2 border-purple-300 rounded-lg p-3 hover:bg-purple-100 transition flex items-center justify-between">
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{resource.name}</p>
                  <p className="text-xs text-gray-600">{resource.number}</p>
                </div>
                <Phone className="w-4 h-4 text-purple-600" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-3">Nearby Services</h3>
          <div className="space-y-2">
            {[
              { name: 'Nearest Police Station', distance: '0.8 mi' },
              { name: 'Emergency Room', distance: '1.2 mi' },
              { name: 'Safe Haven Location', distance: '0.5 mi' }
            ].map((location, idx) => (
              <button key={idx} className="w-full bg-white border-2 border-blue-300 rounded-lg p-3 hover:bg-blue-100 transition flex items-center justify-between">
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{location.name}</p>
                  <p className="text-xs text-gray-600">{location.distance} away</p>
                </div>
                <MapPin className="w-4 h-4 text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 px-4 py-2 flex justify-around">
      {[
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'incidents', icon: FileText, label: 'Incidents' },
        { id: 'contacts', icon: Users, label: 'Contacts' },
        { id: 'resources', icon: BookOpen, label: 'Resources' }
      ].map(nav => (
        <button
          key={nav.id}
          onClick={() => setCurrentView(nav.id)}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition ${
            currentView === nav.id 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <nav.icon className="w-6 h-6" />
          <span className="text-xs font-semibold">{nav.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">SafeCircle</h1>
            <p className="text-xs text-blue-100">Your Personal Safety Companion</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {currentView === 'home' && <HomeView />}
        {currentView === 'incidents' && <IncidentsView />}
        {currentView === 'contacts' && <ContactsView />}
        {currentView === 'resources' && <ResourcesView />}
      </div>

      {/* Navigation */}
      <NavBar />
    </div>
  );
}
