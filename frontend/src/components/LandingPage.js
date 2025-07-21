import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSubmitComplaint = () => {
    navigate('/submit');
  };

  const handleTrackComplaint = () => {
    navigate('/track');
  };

  const handleWhatsAppChat = () => {
    // WhatsApp Business number - replace with actual number
    const whatsappNumber = '+971583087646'; // Replace with your WhatsApp Business number
    const message = 'Hi! I want to submit a complaint through WhatsApp chatbot.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    {
      icon: '📝',
      title: 'Easy Complaint Submission',
      description: 'Submit your grievances quickly with our user-friendly form or WhatsApp chatbot. Attach photos and get instant ticket ID.',
      titleHindi: 'आसान शिकायत दर्ज'
    },
    {
      icon: '📱',
      title: 'Real-time Tracking',
      description: 'Track your complaint status anytime with your unique ticket ID via web or WhatsApp. Get updates at every step.',
      titleHindi: 'रियल-टाइम ट्रैकिंग'
    },
    {
      icon: '💬',
      title: 'WhatsApp Integration',
      description: 'Use our WhatsApp chatbot for convenient complaint submission and tracking. Available 24/7 in Hindi and English.',
      titleHindi: 'व्हाट्सऐप एकीकरण'
    },
    {
      icon: '⚡',
      title: 'Quick Resolution',
      description: 'Our dedicated team works to resolve your complaints within 7 days with proper status updates via all channels.',
      titleHindi: 'त्वरित समाधान'
    },
    {
      icon: '🔒',
      title: 'Secure & Transparent',
      description: 'Your data is secure with us. Complete transparency in complaint handling through web and WhatsApp.',
      titleHindi: 'सुरक्षित और पारदर्शी'
    },
    {
      icon: '🌐',
      title: 'Multi-Channel Access',
      description: 'Access our services through website or WhatsApp - whatever suits you best. Same features, multiple ways.',
      titleHindi: 'मल्टी-चैनल एक्सेस'
    }
  ];

  const departments = [
    'Water Supply', 'Sanitation', 'Road', 'Electricity', 
    'Health', 'Education', 'Social Welfare', 'Transport'
  ];

  const stats = [
    { number: '1000+', label: 'Complaints Resolved', labelHindi: 'शिकायतें हल' },
    { number: '10', label: 'Wards Covered', labelHindi: 'वार्ड कवर' },
    { number: '8', label: 'Departments', labelHindi: 'विभाग' },
    { number: '24/7', label: 'WhatsApp Support', labelHindi: 'व्हाट्सऐप सहायता' }
  ];

  const whatsappFeatures = [
    {
      icon: '📱',
      title: 'Submit Complaints',
      description: 'Send complaint details directly through WhatsApp',
      titleHindi: 'शिकायत दर्ज करें'
    },
    {
      icon: '📷',
      title: 'Send Photos',
      description: 'Attach photos of issues directly in WhatsApp chat',
      titleHindi: 'फोटो भेजें'
    },
    {
      icon: '🔍',
      title: 'Track Status',
      description: 'Get real-time updates on your complaint status',
      titleHindi: 'स्थिति ट्रैक करें'
    },
    {
      icon: '🤖',
      title: 'Smart Bot',
      description: 'AI-powered chatbot guides you through the process',
      titleHindi: 'स्मार्ट बॉट'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Grievance Redressal Portal</h1>
            <h2 className="hero-subtitle">रोहतक शिकायत पोर्टल में आपका स्वागत है</h2>
            <p className="hero-description">
              Your voice matters! Submit and track your complaints easily through our website or WhatsApp chatbot. 
              We're here to serve you better and ensure transparent governance in any city/district.
            </p>
            <p className="hero-description-hindi">
              आपकी आवाज़ मायने रखती है! हमारी वेबसाइट या व्हाट्सऐप चैटबॉट के माध्यम से अपनी शिकायतें आसानी से दर्ज करें और ट्रैक करें।
            </p>
            
            <div className="hero-actions">
              <button 
                onClick={handleSubmitComplaint}
                className="hero-btn primary-btn"
              >
                📝 Submit on Website
                <span className="btn-subtitle">वेबसाइट पर दर्ज करें</span>
              </button>
              
              <button 
                onClick={handleWhatsAppChat}
                className="hero-btn whatsapp-btn"
              >
                💬 Use WhatsApp Bot
                <span className="btn-subtitle">व्हाट्सऐप बॉट का उपयोग करें</span>
              </button>
              
              <button 
                onClick={handleTrackComplaint}
                className="hero-btn secondary-btn"
              >
                🔍 Track Complaint
                <span className="btn-subtitle">शिकायत ट्रैक करें</span>
              </button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="graphic-circle">
                <div className="graphic-icon">🏛️</div>
                <div className="graphic-text">City</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="whatsapp-section">
        <div className="whatsapp-content">
          <div className="whatsapp-info">
            <div className="whatsapp-header">
              <div className="whatsapp-icon">💬</div>
              <h2>WhatsApp Chatbot</h2>
              <p>व्हाट्सऐप चैटबॉट</p>
            </div>
            
            <div className="whatsapp-description">
              <h3>Submit Complaints via WhatsApp!</h3>
              <p>
                Our AI-powered WhatsApp chatbot makes it even easier to submit and track your complaints. 
                Simply send a message and our bot will guide you through the entire process.
              </p>
              <p className="whatsapp-description-hindi">
                हमारा AI-पावर्ड व्हाट्सऐप चैटबॉट आपकी शिकायतें दर्ज करना और ट्रैक करना और भी आसान बनाता है।
              </p>
            </div>

            <div className="whatsapp-number">
              <h4>📱 WhatsApp Number:</h4>
              <div className="number-display">+91 79778 12345</div>
              <p>Available 24/7 • हमेशा उपलब्ध</p>
            </div>

            <div className="whatsapp-cta">
              <button onClick={handleWhatsAppChat} className="whatsapp-chat-btn">
                💬 Start WhatsApp Chat
                <span>व्हाट्सऐप चैट शुरू करें</span>
              </button>
            </div>
          </div>

          <div className="whatsapp-features-grid">
            {whatsappFeatures.map((feature, index) => (
              <div key={index} className="whatsapp-feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p className="feature-title-hindi">{feature.titleHindi}</p>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use WhatsApp Section */}
      <section className="whatsapp-guide-section">
        <div className="section-header">
          <h2>How to Use WhatsApp Chatbot</h2>
          <p>व्हाट्सऐप चैटबॉट का उपयोग कैसे करें</p>
        </div>
        
        <div className="whatsapp-steps">
          <div className="whatsapp-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Click WhatsApp Button</h3>
              <p>Click the "Start WhatsApp Chat" button above</p>
              <p className="step-hindi">ऊपर "व्हाट्सऐप चैट शुरू करें" बटन पर क्लिक करें</p>
            </div>
          </div>
          
          <div className="step-arrow">→</div>
          
          <div className="whatsapp-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Send "Hi" or "शिकायत"</h3>
              <p>Start conversation with our chatbot</p>
              <p className="step-hindi">हमारे चैटबॉट से बातचीत शुरू करें</p>
            </div>
          </div>
          
          <div className="step-arrow">→</div>
          
          <div className="whatsapp-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Follow Bot Instructions</h3>
              <p>Bot will guide you to submit or track complaints</p>
              <p className="step-hindi">बॉट आपको शिकायत दर्ज करने में मदद करेगा</p>
            </div>
          </div>
          
          <div className="step-arrow">→</div>
          
          <div className="whatsapp-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Get Instant Ticket ID</h3>
              <p>Receive ticket ID immediately for tracking</p>
              <p className="step-hindi">ट्रैकिंग के लिए तुरंत टिकट आईडी प्राप्त करें</p>
            </div>
          </div>
        </div>

        <div className="whatsapp-sample">
          <h3>Sample WhatsApp Conversation</h3>
          <div className="chat-preview">
            <div className="chat-message user-message">
              <span>Hi, I want to submit a complaint</span>
            </div>
            <div className="chat-message bot-message">
              <span>🤖 Hello! I'm here to help you submit your complaint. Please choose:</span>
              <br />
              <span>1️⃣ Submit New Complaint</span>
              <br />
              <span>2️⃣ Track Existing Complaint</span>
            </div>
            <div className="chat-message user-message">
              <span>1</span>
            </div>
            <div className="chat-message bot-message">
              <span>📝 Great! Let's submit your complaint. First, please tell me your name.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-label-hindi">{stat.labelHindi}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Our Portal?</h2>
          <p>हमारे पोर्टल को क्यों चुनें?</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <h4>{feature.titleHindi}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <div className="section-header">
          <h2>Departments We Serve</h2>
          <p>हमारे सेवा विभाग</p>
        </div>
        
        <div className="departments-grid">
          {departments.map((dept, index) => (
            <div key={index} className="department-card">
              <div className="department-name">{dept}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Access Methods Section */}
      <section className="access-methods-section">
        <div className="section-header">
          <h2>Choose Your Preferred Method</h2>
          <p>अपना पसंदीदा तरीका चुनें</p>
        </div>
        
        <div className="access-methods">
          <div className="access-method">
            <div className="method-icon">🌐</div>
            <h3>Website Portal</h3>
            <p>Complete web interface with all features</p>
            <p className="method-hindi">सभी सुविधाओं के साथ पूर्ण वेब इंटरफेस</p>
            <ul>
              <li>✅ Detailed forms</li>
              <li>✅ Photo upload</li>
              <li>✅ Admin dashboard</li>
              <li>✅ Comprehensive tracking</li>
            </ul>
            <button onClick={handleSubmitComplaint} className="method-btn">
              Use Website
            </button>
          </div>
          
          <div className="access-method">
            <div className="method-icon">💬</div>
            <h3>WhatsApp Chatbot</h3>
            <p>Quick and convenient mobile experience</p>
            <p className="method-hindi">त्वरित और सुविधाजनक मोबाइल अनुभव</p>
            <ul>
              <li>✅ 24/7 availability</li>
              <li>✅ Voice messages</li>
              <li>✅ Photo sharing</li>
              <li>✅ Instant responses</li>
            </ul>
            <button onClick={handleWhatsAppChat} className="method-btn whatsapp">
              Use WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Submit Your Complaint?</h2>
          <p>अपनी शिकायत दर्ज करने के लिए तैयार हैं?</p>
          <p className="cta-description">
            Choose your preferred method - Website or WhatsApp. Both offer the same powerful features!
          </p>
          
          <div className="cta-actions">
            <button 
              onClick={handleSubmitComplaint}
              className="cta-btn primary"
            >
              Submit via Website
            </button>
            <button 
              onClick={handleWhatsAppChat}
              className="cta-btn whatsapp"
            >
              Submit via WhatsApp
            </button>
            <button 
              onClick={handleTrackComplaint}
              className="cta-btn secondary"
            >
              Track Existing Complaint
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Grievance Redressal Portal</h3>
            <p>Serving the citizens of city with transparency and efficiency through multiple channels.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Access</h4>
            <ul>
              <li><button onClick={handleSubmitComplaint}>Submit via Website</button></li>
              <li><button onClick={handleWhatsAppChat}>Submit via WhatsApp</button></li>
              <li><button onClick={handleTrackComplaint}>Track Complaint</button></li>
              <li><button onClick={() => navigate('/admin')}>Admin Login</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>💬 WhatsApp: +91 79778 08912</p>
            <p>📧 Email: support@citygrievance.gov.in</p>
            <p>📞 Phone: +91-1262-XXX-XXX</p>
            <p>🏢 District Collectorate</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Grievance Redressal Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
