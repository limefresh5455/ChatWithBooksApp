import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-content">
        <h1 className="title">📚 ChatWithBooks – Account Deletion</h1>
        <p className="subtitle">
          Welcome to ChatWithBooks account management.  
          Here you can request deletion of your account and all associated data.
        </p>

        <h2>🔑 Steps to Delete Your Account</h2>
        <ol>
          <li>Log in with your registered account credentials.</li>
          <li>Go to your Dashboard.</li>
          <li>Click the <b>Delete Account</b> button.</li>
          <li>Confirm deletion – once confirmed, your account and associated data will be permanently deleted.</li>
        </ol>

        <h2>🗑️ What Data Will Be Deleted?</h2>
        <ul>
          <li>Your profile information (name, email, phone).</li>
          <li>Uploaded videos/images.</li>
          <li>Saved chats and preferences.</li>
          <li>Any subscription data linked to your account.</li>
        </ul>

        <h2>📌 Retained Data (if applicable)</h2>
        <p>
          Certain transactional or legal records may be retained for up to 30 days 
          as required by law or payment processors. After this period, all data will be removed.
        </p>

        <div className="action">
          <Link to="/" className="btn primary_btn">
            Proceed to Login & Delete Account
          </Link>
        </div>
      </div>
    </div>
  );
};

 
export default Welcome
