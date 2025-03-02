import React from 'react';
import '../style/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 animate-fade-in">
              <h1>Your Health Is Our Priority</h1>
              <p>
              We bring good healthcare to your village. Our friendly doctors and modern tools are here to help you and your family stay healthy.
              </p>
              <div className="button-container">
                <Link to="/book-appointment">
                  <button className="btn btn-primary">Book an Appointment</button>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 animate-fade-in">
              <img
                src="https://www.motherhoodindia.com/wp-content/uploads/2021/09/Contact-page-Book-an-Appointment_Mobile-banner_578X364-px-02.jpg"
                alt="Doctor and patient"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title text-center animate-fade-in">
            <h2>Our Features</h2>
            <p>What makes us different</p>
          </div>

          <div className="row feature-item animate-slide-right">
            <div className="col-lg-6 order-lg-1">
              <img
                src="https://www.verywellhealth.com/thmb/XHhQWkEg9aMaEEbXjQLm1jFBGz0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/VWH-GettyImages-1406496671-d559150d3c294b8282f546c5bbf21157.jpg"
                alt="Expert Doctors"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-lg-6 order-lg-2 my-auto">
              <h3>Expert Doctors</h3>
              <p>
              Our doctors know how to care for you. They have helped many people like you and will listen to your needs with kindness.
              </p>
              <p>
                Our team consists of highly qualified doctors with years of experience in their respective fields.
                We ensure that you receive the best medical advice and treatment available, tailored to your
                specific needs and conditions.
              </p>
            </div>
          </div>

          <div className="row feature-item animate-slide-left">
            <div className="col-lg-6 order-lg-2">
              <img
                src="data:image/jpeg;base64,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"
                alt="Modern Facilities"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-lg-6 order-lg-1 my-auto">
              <h3>Modern Facilities</h3>
              <p>
              We use easy-to-understand methods and the latest tools to check your health and treat you right, close to home.
              </p>
              <p>
                We pride ourselves on having state-of-the-art medical facilities and equipment. Our modern
                infrastructure allows us to provide accurate diagnoses and effective treatments for a wide range
                of medical conditions. Your comfort and care are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;