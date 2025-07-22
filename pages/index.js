import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <>
      <Head>
        <title>Let's Show The World - Anonymous SV Documentation</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        {/* Emergency Exit Button - Top Right */}
        <button
          onClick={() => window.location.href = 'https://www.google.com'}
          className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors z-50"
          title="Emergency Exit"
        >
          Quick Exit
        </button>

        {/* Header */}
        <header className="bg-green-800 text-white py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-center">Let's Show The World</h1>
            <p className="text-center mt-2 text-green-100">
              Anonymous Documentation Platform for Change
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          
          {!showRegistration ? (
            // Welcome Screen
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">
                  Your Experience Matters
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="font-semibold text-green-800 mb-2">Completely Anonymous</h3>
                    <p className="text-gray-600 text-sm">No personal information required. Your privacy is guaranteed.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="font-semibold text-green-800 mb-2">Patterns Revealed</h3>
                    <p className="text-gray-600 text-sm">Your experience contributes to meaningful data that drives change.</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="font-semibold text-green-800 mb-2">Global Impact</h3>
                    <p className="text-gray-600 text-sm">Help create the world's most comprehensive understanding.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Begin Anonymous Documentation
                  </button>
                  
                  <div className="text-center">
                    <button className="text-green-700 hover:text-green-800 underline">
                      View Aggregated Data Patterns
                    </button>
                  </div>
                </div>
              </div>

              {/* Crisis Resources Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400 text-xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>If you are in a current crisis:</strong> Please call your local emergency number or crisis hotline. 
                      This platform is for documenting past experiences, not immediate crisis support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Registration Form
            <RegistrationForm onBack={() => setShowRegistration(false)} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-green-800 text-white py-6 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-green-100">
              Platform in Development • Privacy-First Design • Healthcare-Level Security
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

// Registration Component (Story 1.1: Anonymous Account Creation)
function RegistrationForm({ onBack }) {
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: '',
    confirmPassword: '',
    securityQuestions: {
      question1: '',
      answer1: '',
      question2: '',
      answer2: '',
      question3: '',
      answer3: ''
    },
    geographicPrecision: 'state'
  })

  const securityQuestionOptions = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What was your favorite childhood book?",
    "What was the model of your first car?",
    "What is your mother's maiden name?",
    "What elementary school did you attend?",
    "What was your childhood nickname?",
    "What street did you grow up on?"
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual registration with Supabase
    alert('Registration system ready for backend integration!')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-800">Create Anonymous Account</h2>
        <button
          onClick={onBack}
          className="text-green-600 hover:text-green-800 underline"
        >
          ← Back
        </button>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-sm text-green-800">
          <strong>Privacy Guarantee:</strong> No personal information is required. 
          Your pseudonym and password are the only identifiers needed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pseudonym */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a Pseudonym *
          </label>
          <input
            type="text"
            value={formData.pseudonym}
            onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Any name you'll remember (not your real name)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">This is how you'll log in. Choose something memorable but not identifying.</p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Create Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Minimum 12 characters"
            minLength="12"
            required
          />
        </div>

        {/* Geographic Precision */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Geographic Precision for Data Sharing
          </label>
          <select
            value={formData.geographicPrecision}
            onChange={(e) => setFormData({...formData, geographicPrecision: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="country">Country level only</option>
            <option value="state">State/Province level</option>
            <option value="city">City level</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Controls how specific location data appears in aggregated patterns.</p>
        </div>

        {/* Security Questions */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Security Questions for Password Recovery</h3>
          <p className="text-sm text-gray-600 mb-4">Choose 3 questions to help recover your account if needed.</p>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Security Question {num} *
              </label>
              <select
                value={formData.securityQuestions[`question${num}`]}
                onChange={(e) => setFormData({
                  ...formData,
                  securityQuestions: {
                    ...formData.securityQuestions,
                    [`question${num}`]: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a question...</option>
                {securityQuestionOptions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                value={formData.securityQuestions[`answer${num}`]}
                onChange={(e) => setFormData({
                  ...formData,
                  securityQuestions: {
                    ...formData.securityQuestions,
                    [`answer${num}`]: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your answer"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-md font-semibold transition-colors"
        >
          Create Anonymous Account
        </button>
      </form>
    </div>
  )
}
