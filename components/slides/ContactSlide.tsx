import React from 'react'
import { BaseSlideProps, ContactSlideData } from './types'
import { Phone, Mail, Globe, MapPin, Linkedin, Twitter } from 'lucide-react'

interface ContactSlideProps extends BaseSlideProps {
  data: ContactSlideData
}

export function ContactSlide({ data, className = '' }: ContactSlideProps) {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            {/* Logo and Company Name */}
            <div className="flex items-center">
              {data.companyLogo ? (
                <img 
                  src={data.companyLogo} 
                  alt={data.companyName}
                  className="h-16 mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{data.companyName}</h3>
                {data.tagline && (
                  <p className="text-gray-600">{data.tagline}</p>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className="space-y-3">
              {data.addresses && data.addresses.length > 0 && (
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    {data.addresses.map((address, index) => (
                      <div key={index} className="mb-2">
                        {address.label && (
                          <p className="font-medium text-gray-900">{address.label}</p>
                        )}
                        <p className="text-gray-700">{address.street}</p>
                        <p className="text-gray-700">{address.city}, {address.state} {address.zip}</p>
                        {address.country && <p className="text-gray-700">{address.country}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.website && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-500 mr-3" />
                  <a href={data.website} className="text-blue-600 hover:underline">
                    {data.website}
                  </a>
                </div>
              )}

              {data.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                    {data.email}
                  </a>
                </div>
              )}

              {data.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <a href={`tel:${data.phone}`} className="text-gray-700">
                    {data.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex space-x-3">
                {data.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                  >
                    {link.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-5 h-5 text-gray-700" />}
                    {link.platform.toLowerCase() === 'twitter' && <Twitter className="w-5 h-5 text-gray-700" />}
                    {!['linkedin', 'twitter'].includes(link.platform.toLowerCase()) && (
                      <Globe className="w-5 h-5 text-gray-700" />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Team Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Team</h3>
            {data.teamContacts && data.teamContacts.map((contact, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{contact.title}</p>
                <div className="space-y-1 text-sm">
                  {contact.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.linkedin && (
                    <div className="flex items-center text-gray-700">
                      <Linkedin className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={contact.linkedin} className="hover:text-blue-600">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Text */}
        {data.legalText && (
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>{data.legalText}</p>
          </div>
        )}
      </div>
    </div>
  )
}