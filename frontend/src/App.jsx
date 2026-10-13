
import { useState, useEffect } from 'react'
import './App.css'

const services = [
  { name: 'Certificates', icon: '📄', description: 'Bonafide, transcripts and other certificates', color: 'blue' },
  { name: 'Fee Payment', icon: '💳', description: 'Tuition fees and payment enquiries', color: 'green' },
  { name: 'ID Card', icon: '🪪', description: 'New ID cards and replacements', color: 'orange' },
  { name: 'Library', icon: '📚', description: 'Books, returns and library assistance', color: 'purple' },
]

function App() {
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [token, setToken] = useState(null)
  const [allTokens, setAllTokens] = useState([])

  async function loadTokens() {
  try {
    const response = await fetch('http://localhost:8080/api/queue')

    if (!response.ok) {
      throw new Error('Failed to load tokens')
    }

    const data = await response.json()
    setAllTokens(data)
  } catch (error) {
    console.error('Error loading tokens:', error)
  }
}
 useEffect(() => {
  loadTokens()
}, [])

  async function bookToken(event) {
    event.preventDefault();

    if (!studentName.trim() || !studentId.trim() || !selectedService) {
      alert('Please fill in all details and select a service.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/queue/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentId: studentId.trim(),
          service: selectedService,
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const savedToken = await response.json();

      setToken({
        number: savedToken.tokenNumber,
        name: savedToken.studentName,
        service: savedToken.service,
      });

      alert('Queue token saved successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Check that the backend and MySQL are running.');
    }
  }


  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">Q</span>
          <span>Campus<span className="brand-highlight">Queue</span>
            <small>COLLEGE STUDENT SERVICES</small>
          </span>
        </a>
        <nav>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#book">Book Token</a>
        </nav>
        <a className="staff-link" href="#staff">Staff Portal ↗</a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">SMART CAMPUS · BETTER SERVICE</span>
            <h1>Less waiting.<br /><span>More learning.</span></h1>
            <p>Skip the long queues. Book your digital token online and know exactly when it is your turn at college.</p>
            <div className="hero-actions">
              <a className="primary-btn" href="#book">Book a Queue Token ↗</a>
              <a className="secondary-btn" href="#services">Explore Services</a>
            </div>
            <div className="hero-stats">
              <div><strong>04</strong><span>Student services</span></div>
              <div><strong>24/7</strong><span>Online access</span></div>
              <div><strong>Easy</strong><span>Token booking</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="queue-card">
              <div className="queue-card-head"><span>YOUR DIGITAL TOKEN</span><span className="live-dot">● LIVE DEMO</span></div>
              <div className="ticket-icon">🎓</div>
              <p className="token-label">Your token number</p>
              <h2>{token ? token.number : 'A-012'}</h2>
              <span className="status-pill">✓ {token ? 'Token Booked' : 'Queue System Ready'}</span>
              <div className="queue-divider" />
              <div className="queue-detail"><span>Service</span><strong>{token ? token.service : 'Certificates'}</strong></div>
              <div className="queue-detail"><span>Student</span><strong>{token ? token.name : 'Demo Student'}</strong></div>
              <div className="queue-detail"><span>People ahead</span><strong>{token ? '0' : '3 students'}</strong></div>
            </div>
            <div className="floating-note"><span>✓</span><div><strong>Simple & paperless</strong><small>Book from anywhere on campus</small></div></div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <div><span className="eyebrow">WHAT DO YOU NEED?</span><h2>College services, <span>made simple.</span></h2></div>
            <p>Choose a service and get your place in the queue.</p>
          </div>
          <div className="service-grid">
            {services.map(service => (
              <button type="button" key={service.name}
                className={`service-card ${selectedService === service.name ? 'selected' : ''}`}
                onClick={() => { setSelectedService(service.name); document.getElementById('book').scrollIntoView({ behavior: 'smooth' }) }}>
                <span className={`service-icon ${service.color}`}>{service.icon}</span>
                <h3>{service.name}</h3><p>{service.description}</p>
                <span className="service-arrow">Select service ↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="booking-section" id="book">
          <div className="booking-info">
            <span className="eyebrow">YOUR TURN, WITHOUT THE WAIT</span>
            <h2>Get your queue<br /><span>token in minutes.</span></h2>
            <p>Enter your student details, choose the service you need, and receive a digital token.</p>
            <div className="booking-benefit">✓ No standing in long queues</div>
            <div className="booking-benefit">✓ Know your token number instantly</div>
            <div className="booking-benefit">✓ Convenient student experience</div>
          </div>
          <form className="booking-form" onSubmit={bookToken}>
            <h3>Book your token</h3>
            <p>Fill in your details to get started.</p>
            <label htmlFor="studentName">Student name</label>
            <input id="studentName" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter your full name" required />
            <label htmlFor="studentId">College ID / Roll number</label>
            <input id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. 24EC001" required />
            <label htmlFor="service">Select service</label>
            <select id="service" value={selectedService} onChange={e => setSelectedService(e.target.value)} required>
              <option value="">Choose a service</option>
              {services.map(service => <option key={service.name} value={service.name}>{service.name}</option>)}
            </select>
            <button className="primary-btn submit-btn" type="submit">Generate My Token →</button>
            {token && <div className="token-result" role="status">
              <span>✓ Your demo token is ready</span>
              <strong>{token.number}</strong>
              <p>{token.name} · {token.service}</p>
              <small>Your token has been saved to the database successfully.</small>
            </div>}
          </form>
          
<div className="all-tokens">
  <h3>All Booked Tokens</h3>
  {allTokens.length === 0 ? (
    <p>No tokens booked yet.</p>
  ) : (
    allTokens.map(item => (
      <div className="token-item" key={item.id}>
        <strong>{item.tokenNumber}</strong>
        <span>{item.studentName}</span>
        <span>{item.service}</span>
        <span>{item.status}</span>
      </div>
    ))
  )}
</div>

        </section>

        <section className="staff-section" id="staff">
          <span className="eyebrow">FOR COLLEGE STAFF</span>
          <h2>Queue management, <span>made easier.</span></h2>
          <p>A future staff dashboard will let authorised staff manage queues, update service status and call the next student.</p>
          <div className="staff-features">
            <div>📋 <strong>Manage tokens</strong><small>View student requests</small></div>
            <div>📣 <strong>Call next student</strong><small>Keep the queue moving</small></div>
            <div>📊 <strong>View reports</strong><small>Review service activity</small></div>
          </div>
        </section>
      </main>

      <footer><a className="brand footer-brand" href="#home"><span className="brand-icon">Q</span> Campus<span className="brand-highlight">Queue</span></a><p>Digital Queue Management System · College Student Services</p><span>Built for a smarter campus.</span></footer>
    </div>
  )
}

export default App
