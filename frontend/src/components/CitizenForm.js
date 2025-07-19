import React, { useState, useRef } from 'react';
import TicketDisplay from './TicketDisplay';
import { DEPARTMENTS, WARDS } from '../utils/constants';
import '../styles/CitizenForm.css';

const CitizenForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    ward: '',
    department: '',
    complaintType: '',
    description: '',
    address: '',
    priority: 'medium'
  });
  
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Universal input handler for all events
  const handleAllInputEvents = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enhanced paste handler
  const handleInputPaste = (e) => {
    const { name } = e.target;
    
    // Small delay to ensure paste content is processed
    setTimeout(() => {
      const value = e.target.value;
      console.log(`Paste event - Field: ${name}, Value: "${value}"`);
      
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }, 10);
  };

  // Enhanced blur handler
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    
    // Ensure state is updated on blur
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetPhoto(file);
    }
  };

  const validateAndSetPhoto = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    setSelectedPhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Start camera using Media Capture API
  const startCamera = async () => {
    try {
      setCameraError('');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported on this browser. Please use the upload option instead.');
        return;
      }

      // Stop any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setCameraStream(stream);
      setShowCamera(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Ensure video plays
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
              setCameraError('Unable to start video feed. Please try again.');
            });
          };
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      handleCameraError(error);
    }
  };

  // Handle camera errors with specific messages
  const handleCameraError = (error) => {
    let errorMessage = 'Unable to access camera. ';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage += 'Please allow camera access in your browser settings and try again.';
        break;
      case 'NotFoundError':
        errorMessage += 'No camera found on this device.';
        break;
      case 'NotReadableError':
        errorMessage += 'Camera is being used by another application.';
        break;
      case 'OverconstrainedError':
        errorMessage += 'Camera does not meet the required specifications.';
        break;
      case 'SecurityError':
        errorMessage += 'Camera access blocked due to security restrictions.';
        break;
      default:
        errorMessage += 'Please check camera permissions or use file upload instead.';
    }
    
    setCameraError(errorMessage);
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError('');
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], `complaint_photo_${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        validateAndSetPhoto(file);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  // Remove photo
  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    stopCamera();
  };

  // Open file picker
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append photo if selected
      if (selectedPhoto) {
        submitData.append('photo', selectedPhoto);
      }

      const response = await fetch('/api/complaints/submit', {
        method: 'POST',
        body: submitData
      });
      
      const data = await response.json();
      
      if (data.success) {
        const ticket = {
          id: data.data.ticketId,
          ...formData,
          status: 'received',
          submittedAt: data.data.submittedAt,
          estimatedResolution: data.data.estimatedResolution,
          hasPhoto: data.data.hasPhoto
        };
        
        setGeneratedTicket(ticket);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          ward: '',
          department: '',
          complaintType: '',
          description: '',
          address: '',
          priority: 'medium'
        });
        removePhoto();
      } else {
        alert('Error submitting complaint: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  if (generatedTicket) {
    return <TicketDisplay ticket={generatedTicket} onNewComplaint={() => setGeneratedTicket(null)} />;
  }

  return (
    <div className="citizen-form-container">
      <div className="form-header">
        <h2>Submit Your Complaint</h2>
        <p>शिकायत दर्ज करें</p>
      </div>

      <form onSubmit={handleSubmit} className="citizen-form" encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleAllInputEvents}
              onPaste={handleInputPaste}
              onBlur={handleInputBlur}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleAllInputEvents}
              onPaste={handleInputPaste}
              onBlur={handleInputBlur}
              required
              placeholder="Enter 10-digit phone number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleAllInputEvents}
              onPaste={handleInputPaste}
              onBlur={handleInputBlur}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ward">Ward *</label>
            <select
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleAllInputEvents}
              onBlur={handleInputBlur}
              required
            >
              <option value="">Select Ward</option>
              {WARDS.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleAllInputEvents}
              onBlur={handleInputBlur}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleAllInputEvents}
              onBlur={handleInputBlur}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="complaintType">Complaint Type *</label>
          <input
            type="text"
            id="complaintType"
            name="complaintType"
            value={formData.complaintType}
            onChange={handleAllInputEvents}
            onPaste={handleInputPaste}
            onBlur={handleInputBlur}
            required
            placeholder="e.g., Water Supply, Road Repair, Garbage Collection"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleAllInputEvents}
            onPaste={handleInputPaste}
            onBlur={handleInputBlur}
            required
            placeholder="Enter complete address where the issue is located"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Complaint Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleAllInputEvents}
            onPaste={handleInputPaste}
            onBlur={handleInputBlur}
            required
            placeholder="Describe your complaint in detail..."
            rows="5"
          />
        </div>

        {/* Photo Upload Section with Camera */}
        <div className="form-group photo-upload-section">
          <label>Add Photo (Optional)</label>
          <p className="photo-help-text">
            Take a photo directly with your camera or upload from your device. Supported formats: JPG, PNG, GIF. Max size: 5MB.
          </p>
          
          <div className="photo-upload-container">
            {!showCamera && !photoPreview && (
              <div className="photo-upload-options">
                <div className="upload-options-grid">
                  <button 
                    type="button" 
                    onClick={startCamera}
                    className="camera-btn"
                  >
                    <div className="camera-icon">📷</div>
                    <span>Take Photo</span>
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={openFilePicker}
                    className="upload-btn"
                  >
                    <div className="upload-icon">📁</div>
                    <span>Upload File</span>
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Camera Interface */}
            {showCamera && (
              <div className="camera-interface">
                <div className="camera-header">
                  <h4>Take a Photo</h4>
                  <button 
                    type="button" 
                    onClick={stopCamera}
                    className="close-camera-btn"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="camera-viewport">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="camera-video"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play();
                      }
                    }}
                    onError={(e) => {
                      console.error('Video error:', e);
                      setCameraError('Video feed error. Please try again.');
                    }}
                  />
                </div>
                
                <div className="camera-controls">
                  <button 
                    type="button" 
                    onClick={capturePhoto}
                    className="capture-btn"
                  >
                    <div className="capture-icon">📸</div>
                    <span>Capture</span>
                  </button>
                </div>
                
                <canvas 
                  ref={canvasRef} 
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Photo Preview */}
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" className="preview-image" />
                <div className="photo-actions">
                  <button type="button" onClick={removePhoto} className="remove-photo-btn">
                    Remove Photo
                  </button>
                  <button type="button" onClick={startCamera} className="retake-photo-btn">
                    Take Another
                  </button>
                  <p className="photo-filename">{selectedPhoto?.name}</p>
                </div>
              </div>
            )}

            {/* Camera Error */}
            {cameraError && (
              <div className="camera-error">
                <div className="error-icon">⚠️</div>
                <p>{cameraError}</p>
                <button type="button" onClick={openFilePicker} className="fallback-upload-btn">
                  Upload File Instead
                </button>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default CitizenForm;
