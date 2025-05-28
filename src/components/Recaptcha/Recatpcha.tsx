import Script from "next/script";

const Recatpcha = () => {
  return (
    <Script
      strategy="beforeInteractive"
      src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
    />
  );
};

export default Recatpcha;
