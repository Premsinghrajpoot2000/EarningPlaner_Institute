import React from "react";
import NavBar from "../Nav Bar/nav_bar";
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  return (
    <div>
      <div>
        <Helmet>
          {/* Page Title */}
          <title>About Us - Earning Planner</title>

          {/* Meta Description for SEO */}
          <meta name="description" content="Earning Planner Institute offers affordable, high-quality IT courses for students in India. Learn real-world tech skills with free & paid courses, hands-on projects, and live sessions. Empower your career with practical, industry-ready knowledge. This is the meta description of my page" />

          {/* Open Graph Tags */}
          <meta property="og:title" content="About Us - Earning Planner" />
          <meta property="og:description" content="Earning Planner Institute offers affordable, high-quality IT courses for students in India. Learn real-world tech skills with free & paid courses, hands-on projects, and live sessions. Empower your career with practical, industry-ready knowledge." />
          <meta property="og:image" content="https://earningplaner.com/About%20Us%202.png" />  {/* Replace with your actual image URL */}
          <meta property="og:url" content="https://earningplaner.com/about-us" />  {/* Actual "About Us" page URL */}
          <meta property="og:type" content="website" />  {/* Specifies that it's a website */}

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="About Us - Earning Planner" />
          <meta name="twitter:description" content="Earning Planner Institute offers affordable, high-quality IT courses for students in India. Learn real-world tech skills with free & paid courses, hands-on projects, and live sessions. Empower your career with practical, industry-ready knowledge." />
          <meta name="twitter:image" content="https://earningplaner.com/About%20Us%202.png" />  {/* Replace with your actual image URL */}
          <meta name="twitter:creator" content="@Earning_Planer" />  {/* Replace with your Twitter handle */}
        </Helmet>
      </div>
      <div>
        <NavBar />
      </div>
      <div
        className="container my-5"
        style={{ backgroundColor: "#f4f4f4", padding: "50px" }}
      >
        {/* First Section: Text Left, Image Right */}
        <div className="row align-items-center mb-5">
          <h2 className="display-4 text-center mb-4">About Us</h2>
          <div className="col-md-6 order-md-1 order-2" data-aos="zoom-in">
            <p className="lead">
              Welcome to <strong>Earning Planner Institute</strong> – a
              revolutionary educational platform dedicated to providing
              affordable IT-related courses and empowering students to build
              their careers in the world of technology. Our mission is simple:
              to make high-quality education accessible to every student in
              India, no matter their financial background.
            </p>
            <p className="lead">
              We understand the struggles faced by students in today's education
              system, especially when it comes to pursuing their dreams in the
              field of Information Technology. Many students focus on preparing
              for government jobs and spend years without truly developing
              valuable, marketable skills. On the other hand, there are many
              talented individuals who have the passion to learn but are held
              back by the high costs of education.
            </p>
          </div>
          <div className="col-md-6 order-md-2 order-1 m-md-0 mb-3" data-aos="zoom-in">
            <img
              src="About Us 1.png" // Replace with your actual image link
              alt="Earning Planner Institute"
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* Second Section: Vision and Mission */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 order-md-1 order-1 m-md-0 mb-3" data-aos="zoom-in">
            <img
              src="/About Us 2.png" // Replace with your actual image link
              alt="Vision of Earning Planner Institute"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6 order-md-2 order-2" data-aos="zoom-in">
            <p className="lead">
              This is why <strong>Earning Planner Institute</strong> was
              created. We believe every student should have access to quality
              education that helps them thrive in the IT industry, regardless of
              their financial background. Our mission is to prioritize
              skill-based learning over outdated models and eliminate barriers
              to affordable education.
            </p>
            <p className="lead">
              Our platform offers a variety of IT courses, many of which are
              free, ensuring that there are no barriers for passionate learners.
              We provide both free and paid courses designed to equip students
              with real-world skills in high-demand tech fields.
            </p>
            <p className="lead">
              At Earning Planner Institute, we focus on practical learning. Our
              courses give students hands-on experience, empowering them to
              solve real-world problems and build a strong portfolio—preparing
              them for success in the job market, not just exams.
            </p>
          </div>
        </div>

        {/* Third Section: Core Values */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 order-md-1 order-2" data-aos="zoom-in">
            <p className="lead">
              Our core values drive everything we do. At Earning Planner
              Institute, we prioritize:
            </p>
            <ul className="lead">
              <li>
                <strong>Affordability:</strong> We believe that financial
                barriers should never stop anyone from learning. Our courses are
                offered at affordable prices, making quality education
                accessible to all students.
              </li>
              <li>
                <strong>Accessibility:</strong> Our platform is available 24/7,
                allowing students to learn at their own pace, from anywhere, at
                any time.
              </li>
              <li>
                <strong>Practical Learning:</strong> We offer a hands-on
                learning experience where students work on real-world projects
                and gain skills that employers are looking for.
              </li>
              <li>
                <strong>Commitment to Growth:</strong> Our mission goes beyond
                providing courses. We aim to create a community of learners who
                support and motivate each other in their journey towards
                success.
              </li>
            </ul>
          </div>
          <div className="col-md-6 order-md-2 order-1 m-md-0 mb-3" data-aos="zoom-in">
            <img
              src="About Us 3.png" // Replace with your actual image link
              alt="Core Values"
              className="img-fluid rounded"
            />
          </div>
        </div>

        {/* Fourth Section: Free Learning Resources */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 order-md-1 order-1 m-md-0 mb-3" data-aos="zoom-in">
            <img
              src="About Us 4.png" // Replace with your actual image link
              alt="Free Learning Resources"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6 order-md-2 order-2" data-aos="zoom-in">
            <p className="lead">
              Additionally, we run our own <strong>YouTube channel</strong>{" "}
              where we upload video lessons and tutorials for all of our
              courses. This allows students to access the material anytime,
              anywhere, and at no cost. Our YouTube channel is a valuable
              resource for students who prefer learning through video content
              and want to enhance their skills at their own pace.
            </p>
            <p className="lead">
              Our platform also offers a comprehensive community where students
              can interact with instructors, ask questions, and collaborate on
              projects. We are committed to ensuring that every student has the
              resources they need to succeed.
            </p>
            <p className="lead">
              At <strong>Earning Planner Institute</strong>, our goal is to
              bridge the gap between education and opportunity, giving every
              student the chance to develop essential IT skills and advance in
              their careers. Whether you're just starting out or looking to
              enhance your skills, our courses and content are designed to help
              you succeed.
            </p>
          </div>
        </div>

        {/* Fifth Section: Our Impact */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 order-md-1 order-2" data-aos="zoom-in">
            <p className="lead">
              Since our inception, we have empowered thousands of students to
              unlock their potential and embark on successful careers in the IT
              industry. Initially, we provided free courses to make education
              accessible to everyone. While this approach helped many, we found
              that students often faced difficulties in clearing their doubts
              due to the lack of live interaction.
            </p>
            <p className="lead">
              We realized that in order to offer a truly impactful learning
              experience, it was necessary to provide more personalized support.
              However, providing free courses with live sessions came with its
              own set of challenges. To maintain the quality of education and
              offer live doubt-clearing sessions, we needed a sustainable model.
              That's why we transitioned to offering affordable paid
              courses, ensuring that students can now learn with live classes
              and get their questions answered in real time, without
              compromising on quality.
            </p>
          </div>
          <div className="col-md-6 order-md-2 order-1 m-md-0 mb-3" data-aos="zoom-in">
            <img
              src="/About Us 5.png" // Replace with your actual image link
              alt="Impact of Earning Planner Institute"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
