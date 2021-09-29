import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="copyrights-container">
        <p>
          Made By &copy;{" "}
          <a
            href="https://github.com/ZaeemKhaliq"
            rel="noopener noreferrer"
            target="_blank"
          >
            Zaeem Khaliq
          </a>
        </p>
      </div>
    </footer>
  );
}
