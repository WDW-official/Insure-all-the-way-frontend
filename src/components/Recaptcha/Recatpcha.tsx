import Script from "next/script";

const Recatpcha = () => {
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      strategy="afterInteractive"
      onLoad={() => {
        console.log("reCAPTCHA script loaded.");
      }}
    />
  );
};

export default Recatpcha;
