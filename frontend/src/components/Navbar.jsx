
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Icon({ name, size = 19 }) {
  const paths = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    message: (
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l-1.42-1.42m14.14-14.14-1.42-1.42" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    back: <path d="m15 18-6-6 6-6" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function UserProfile({ user }) {
  return (
    <div className="paid-user-profile">
      <div className="paid-user-avatar">
        {(user?.name || "U").charAt(0).toUpperCase()}
      </div>

      <div className="paid-user-details">
        <span className="paid-user-name">
          {user?.name || "User"}
        </span>

        <span className="paid-user-role">
          {user?.role || "Member"}
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data, isLoading } = useGetMeQuery();

  const [chatOpen, setChatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [conversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageDraft, setMessageDraft] = useState("");

  const user =
    data?.user ||
    data?.data?.user ||
    data?.currentUser ||
    null;

  const dashboard =
    user?.role === "client"
      ? "/client/dashboard"
      : "/freelancer/dashboard";

  const logo = theme === "light" ? "/logo.png" : "/logo1.png";

  const closeMenus = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Logout failed (${response.status})`);
      }

      navigate("/login", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Unable to log out:", error);
    }
  };

  return (
    <>
      <header className="site-header paid-navbar">
        <nav className="site-nav paid-navbar-main" aria-label="Main navigation">
          <Link
            to="/"
            className="brand paid-navbar-brand"
            aria-label="PaidLancer home"
            onClick={closeMenus}
          >
            <img src={logo} alt="PaidLancer" className="paid-navbar-logo" />
          </Link>

          <div className="paid-navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `paid-nav-link ${isActive ? "active" : ""}`
              }
            >
              Discover
            </NavLink>

            {user && (
              <Link to={dashboard} className="paid-nav-link">
                Manage work
              </Link>
            )}
          </div>

          <div className="paid-navbar-actions">
            {user && (
              <>
                <button
                  type="button"
                  className="paid-icon-button"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Icon name="bell" />
                </button>

                <button
                  type="button"
                  className={`paid-icon-button ${chatOpen ? "is-active" : ""}`}
                  aria-label={chatOpen ? "Close messages" : "Open messages"}
                  aria-expanded={chatOpen}
                  onClick={() => {
                    setChatOpen((open) => !open);
                    setActiveConversation(null);
                    setMessageDraft("");
                  }}
                >
                  <Icon name="message" />
                </button>

                {/* Replaces the Dashboard button */}
                <UserProfile user={user} />
              </>
            )}

            {!isLoading && !user && (
              <div className="paid-auth-actions">
                <Link to="/login" className="paid-login-link">
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="button button-primary paid-get-started"
                >
                  Get started
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle paid-theme-toggle"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
            </button>

            <button
              type="button"
              className="paid-mobile-menu-button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="paid-mobile-menu">
            <div className="paid-mobile-nav-links">
              <NavLink to="/" end onClick={closeMenus}>
                Discover
              </NavLink>

              {user ? (
                <>
                  <Link to={dashboard} onClick={closeMenus}>
                    Manage work
                  </Link>

                  {/* Replaces the mobile Dashboard link */}
                  <div className="paid-mobile-profile">
                    <UserProfile user={user} />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setChatOpen(true);
                      setActiveConversation(null);
                      setMobileOpen(false);
                    }}
                  >
                    <Icon name="message" size={17} />
                    Messages
                  </button>

                  <button type="button" onClick={handleLogout}>
                    Sign out
                  </button>
                </>
              ) : (
                <div className="paid-mobile-auth">
                  <Link to="/login" onClick={closeMenus}>
                    Log in
                  </Link>

                  <Link to="/register" onClick={closeMenus}>
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {user && chatOpen && (
        <section className="paid-chat-widget" aria-label="Messages">
          <aside className="paid-chat-sidebar">
            <div className="paid-chat-sidebar-header">
              <div>
                <h2>Messages</h2>
                <p>Your conversations</p>
              </div>

              <button
                type="button"
                className="paid-chat-close"
                aria-label="Close messages"
                onClick={() => {
                  setChatOpen(false);
                  setActiveConversation(null);
                }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="paid-chat-conversation-list">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation._id}
                    className={`paid-chat-conversation-item ${
                      activeConversation?._id === conversation._id
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveConversation(conversation);
                      setMessageDraft("");
                    }}
                  >
                    <span className="paid-chat-avatar">
                      {(conversation.name || "U").charAt(0).toUpperCase()}
                    </span>

                    <span className="paid-chat-conversation-info">
                      <strong>{conversation.name || "Conversation"}</strong>
                      <span>
                        {conversation.lastMessage || "Open conversation"}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="paid-chat-list-empty">
                  <Icon name="message" size={24} />
                  <strong>No conversations yet</strong>
                  <p>Your conversations will appear here once connected.</p>
                </div>
              )}
            </div>
          </aside>

          <div className="paid-chat-main">
            {activeConversation ? (
              <>
                <div className="paid-chat-main-header">
                  <button
                    type="button"
                    className="paid-chat-back"
                    aria-label="Back to conversations"
                    onClick={() => setActiveConversation(null)}
                  >
                    <Icon name="back" size={18} />
                  </button>

                  <span className="paid-chat-avatar">
                    {(activeConversation.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div>
                    <strong>
                      {activeConversation.name || "Conversation"}
                    </strong>
                    <small>Conversation</small>
                  </div>
                </div>

                <div className="paid-chat-history">
                  <div className="paid-chat-list-empty">
                    <Icon name="message" size={24} />
                    <strong>No messages loaded</strong>
                    <p>Connect your messages API to load this conversation.</p>
                  </div>
                </div>

                <form
                  className="paid-chat-compose"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <input
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    placeholder="Messaging will be available soon"
                    aria-label="Write a message"
                    maxLength={1000}
                    disabled
                  />

                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled
                    title="Connect the messaging API to send messages"
                  >
                    <Icon name="send" size={17} />
                  </button>
                </form>
              </>
            ) : (
              <div className="paid-chat-no-selection">
                <span className="paid-chat-empty-icon">
                  <Icon name="message" size={25} />
                </span>

                <strong>Select a conversation</strong>
                <p>Choose a conversation from the list to open it here.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
