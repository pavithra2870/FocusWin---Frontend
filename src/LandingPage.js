import SplineObj from './SplineObj';
import Footer from './Footer';

function LandingPage() {
  return (
    <>
      

      {/* Main Content Container */}

        {/* Spline Section - Full viewport height */}
        <section className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="w-full h-full pt-20">
            <SplineObj />
          </div>
        </section>
    <Footer/>
    </>
  );
}

export default LandingPage;
