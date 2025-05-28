export const getCaptchaToken = (action: string) => {
  return new Promise<string | null>((resolve, reject) => {
    grecaptcha.ready(async () => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

      if (!siteKey) {
        reject("No site keys found");
        return;
      }

      const token = await grecaptcha.execute(siteKey, {
        action,
      });

      console.log(token, "Captcha token");

      resolve(token);
    });
  });
};
