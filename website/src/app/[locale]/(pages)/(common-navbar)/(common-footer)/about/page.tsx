import { getAboutPage } from "@/features/about/api/action";
import AboutClientComponent from "./components/AboutClient";

// This is a Server Component that just fetches the data
export default async function AboutPage() {
  try {
    // Fetch the about data
    const aboutData = await getAboutPage();
    
    if (!aboutData) {
      throw new Error("Failed to load about page data");
    }
    
    // We'll use client-side rendering in the AboutClient component
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{aboutData.title || "About Us"}</h1>
          
          {/* Pass the JSON data as a serialized prop */}
          <AboutClientComponent dataJson={JSON.stringify(aboutData)} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching about data:", error);
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          <div className="py-10 text-center text-gray-500">
            Content is being updated. Please check back later.
          </div>
        </div>
      </div>
    );
  }
} 