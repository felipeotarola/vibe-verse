import { Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">Contact Us</h1>
          <p className="mt-2 text-gray-300">Get in touch with the Copernic team</p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Send Message</Button>
              </form>
            </div>
          </div>

          <div>
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-purple-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Email</p>
                    <p className="text-white">contact@copernic.dev</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-purple-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Phone</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Address</p>
                    <p className="text-white">
                      123 Innovation Way
                      <br />
                      Tech District
                      <br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Office Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday - Friday</span>
                  <span className="text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Saturday</span>
                  <span className="text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunday</span>
                  <span className="text-white">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
