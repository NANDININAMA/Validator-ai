import React, { useState, useEffect } from "react";

function MultiStepIdeaForm({ onSubmit, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    problem: "",
    solution: "",
    market: "",
    revenueModel: "",
    team: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      id: 'problem',
      title: 'Problem Statement',
      icon: '🎯',
      description: 'What problem are you solving?',
      placeholder: 'Describe the specific problem your startup addresses. What pain point does it solve? Who experiences this problem?',
      minLength: 50,
      maxLength: 500
    },
    {
      id: 'solution',
      title: 'Solution Overview',
      icon: '💡',
      description: 'How do you solve this problem?',
      placeholder: 'Explain your solution in detail. How does it work? What makes it unique or innovative?',
      minLength: 50,
      maxLength: 500
    },
    {
      id: 'market',
      title: 'Target Market',
      icon: '🎯',
      description: 'Who are your customers?',
      placeholder: 'Define your target market. Who are your ideal customers? What is the market size and opportunity?',
      minLength: 30,
      maxLength: 400
    },
    {
      id: 'revenueModel',
      title: 'Revenue Model',
      icon: '💰',
      description: 'How will you make money?',
      placeholder: 'Describe your business model. How will you generate revenue? What are your pricing strategies?',
      minLength: 30,
      maxLength: 400
    },
    {
      id: 'team',
      title: 'Team & Execution',
      icon: '👥',
      description: 'Who will execute this vision?',
      placeholder: 'Tell us about your team. What are their backgrounds, skills, and relevant experience?',
      minLength: 30,
      maxLength: 400
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const savedForm = localStorage.getItem('ideaFormDraft');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setForm(parsed);
      } catch (e) {
        console.error('Failed to load saved form:', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('ideaFormDraft', JSON.stringify(form));
    }, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const value = form[step.id];
    const newErrors = {};

    if (!value.trim()) {
      newErrors[step.id] = 'This field is required';
    } else if (value.length < step.minLength) {
      newErrors[step.id] = `Please provide at least ${step.minLength} characters`;
    } else if (value.length > step.maxLength) {
      newErrors[step.id] = `Please keep it under ${step.maxLength} characters`;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
      }
    }

    if (!allValid) {
      // Go to first step with error
      const firstErrorStep = steps.findIndex(step => errors[step.id]);
      if (firstErrorStep !== -1) {
        setCurrentStep(firstErrorStep);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(form);
        // Clear saved draft on successful submission
        localStorage.removeItem('ideaFormDraft');
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const currentValue = form[currentStepData.id];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentValue.trim().length >= currentStepData.minLength;

  return (
    <div className="chatbot-modal" onClick={(e) => { if (e.target === e.currentTarget && onCancel) onCancel(); }} role="dialog" aria-modal="true">
      <div className="enhanced-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onCancel} aria-label="Close form">✕</button>
        
        {/* Header */}
        <div className="form-header">
          <div className="form-title">
            <h2>🚀 Startup Idea Submission</h2>
            <p>Let's build your idea step by step</p>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">{currentStep + 1} of {steps.length}</span>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="step-navigation">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`step-nav-item ${
                index === currentStep ? 'active' : 
                form[step.id].trim().length >= step.minLength ? 'completed' : ''
              }`}
              onClick={() => goToStep(index)}
              disabled={isSubmitting}
            >
              <span className="step-icon">{step.icon}</span>
              <span className="step-label">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={submit} className="enhanced-form">
          <div className="step-content">
            <div className="step-header">
              <h3>{currentStepData.icon} {currentStepData.title}</h3>
              <p>{currentStepData.description}</p>
            </div>

            <div className="form-field">
              <div className="field-header">
                <label htmlFor={currentStepData.id}>
                  {currentStepData.title}
                  <span className="required">*</span>
                </label>
                <div className="char-counter">
                  <span className={currentValue.length < currentStepData.minLength ? 'insufficient' : 'sufficient'}>
                    {currentValue.length}
                  </span>
                  <span className="counter-separator">/</span>
                  <span className="max-chars">{currentStepData.maxLength}</span>
                </div>
              </div>
              
              <textarea
                id={currentStepData.id}
                value={currentValue}
                onChange={(e) => updateField(currentStepData.id, e.target.value)}
                placeholder={currentStepData.placeholder}
                className={`form-textarea ${
                  errors[currentStepData.id] ? 'error' : 
                  canProceed ? 'valid' : ''
                }`}
                rows="6"
                maxLength={currentStepData.maxLength}
                disabled={isSubmitting}
              />
              
              {errors[currentStepData.id] && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors[currentStepData.id]}
                </div>
              )}
              
              <div className="field-requirements">
                <span className={`requirement ${currentValue.length >= currentStepData.minLength ? 'met' : ''}`}>
                  ✓ Minimum {currentStepData.minLength} characters
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <div className="nav-left">
              {currentStep > 0 && (
                <button 
                  type="button" 
                  className="btn-nav btn-prev" 
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  ← Previous
                </button>
              )}
            </div>
            
            <div className="nav-right">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              {!isLastStep ? (
                <button 
                  type="button" 
                  className="btn-nav btn-next" 
                  onClick={nextStep}
                  disabled={!canProceed || isSubmitting}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary btn-submit"
                  disabled={!canProceed || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    '🚀 Submit Idea'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MultiStepIdeaForm;