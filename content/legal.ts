/** Long-form policy copy, kept as data so one renderer serves all of it. */

export type LegalDoc = {
  title: string;
  sections: { h: string; p: string }[];
};

export type LegalKey = "about" | "privacy" | "terms" | "cookies";

export const LEGAL: Record<LegalKey, LegalDoc> = {
  about: {
    title: "About O-Fash Markett",
    sections: [
      {
        h: "Who We Are",
        p: "O-Fash Markett is the digital branch of Africa's vibrant fashion market. We are not another fashion store or logistics company. We are building an app that serves as the structure between the market, the customer, and the delivery channel all activities happening simultaneously in one app.",
      },
      {
        h: "Our Mission",
        p: "We connect buyers, sellers, and riders within one seamless ecosystem, making local fashion markets more accessible with just one click. It's the same feeling as teleporting to the physical market.",
      },
      {
        h: "Our Vision",
        p: "Our vision is to create a future where every fashion item available in the local market can also be found at O-Fash Markett. We believe the traditional African market is a cultural treasure worth preserving, so our goal is not to replace it, but to expand it through technology.",
      },
      {
        h: "How It Works",
        p: "With O-Fash Markett, buyers can easily discover vendors, sellers gain greater visibility beyond algorithm reach, and riders access more delivery opportunities. We believe e-commerce works best when everyone wins.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        h: "1. Information We Collect",
        p: "We collect the following information when you use O-Fash Markett: full name, email address, phone number, delivery address, payment and transaction details, location information, account and order history, communications between users vendors and riders, and business registration information for onboarding and verifying sellers.",
      },
      {
        h: "2. How We Use Your Information",
        p: "We use your information to process orders and deliveries, connect buyers, sellers, and riders, improve platform performance and user experience, provide customer support, send important updates and notifications, maintain platform safety and prevent fraudulent activity, and analyze and personalize your user experience.",
      },
      {
        h: "3. Sharing Your Information",
        p: "O-Fash Markett does not sell users' personal information. We may share limited information with vendors and riders to fulfil orders, escrow payment service providers for secure transactions, and service providers supporting our platform operation.",
      },
      {
        h: "4. Data Protection",
        p: "We implement reasonable security measures to protect user information from unauthorized access, loss, misuse, or alteration. Payment details are handled by certified payment processors, and O-Fash Markett holds funds in escrow without storing full card details on our servers.",
      },
      {
        h: "5. Cookies and Tracking",
        p: "We may use cookies and similar technologies to improve functionality, analyze usage, and personalize your user experience. You may control or disable cookies through your browser or device settings, though this may affect platform functionality.",
      },
      {
        h: "6. WhatsApp Communications",
        p: "If you provide your WhatsApp number, we will only use it to send launch updates and critical order notifications. You can opt out at any time by replying STOP.",
      },
      {
        h: "7. User Rights",
        p: "You have the right to access your personal information, request corrections to inaccurate data, and request account deletion subject to legal and operational requirements. Contact us at contact@o-fashmarkett.com for any such requests.",
      },
      {
        h: "8. Third-Party Services",
        p: "Some of our functionality may rely on trusted third-party services. These third parties may collect limited information in accordance with their own privacy policies.",
      },
      {
        h: "9. Changes to This Policy",
        p: "We may update this Privacy Policy from time to time. Continued use of the platform after updates means acceptance of the revised policy.",
      },
      {
        h: "10. Contact Us",
        p: "For questions or concerns regarding this Privacy Policy, contact O-Fash Markett at contact@o-fashmarkett.com or through our official communication channels.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        h: "1. Acceptance of Terms",
        p: "By accessing or using O-Fash Markett, you agree to comply with and be bound by these Terms of Service.",
      },
      {
        h: "2. About O-Fash Markett",
        p: "O-Fash Markett is a digital marketplace that connects buyers, fashion vendors, and riders within the African fashion ecosystem. Our platform helps facilitate fashion discovery, transactions, and delivery services.",
      },
      {
        h: "3. User Accounts",
        p: "You may be required to create an account to access the platform. By creating an account, you agree to provide accurate and complete information, keep your login credentials secure, and accept responsibility for activities carried out under your account. O-Fash Markett reserves the right to suspend or terminate accounts that provide false information or violate these terms.",
      },
      {
        h: "4. Eligibility",
        p: "You must be at least 18 years old to use O-Fash Markett and have the legal capacity to enter this agreement.",
      },
      {
        h: "5. Marketplace Activities",
        p: "You agree to use the platform lawfully and respectfully. You must not sell counterfeit, illegal, damaged or prohibited items; engage in fraudulent transactions; impersonate another person or business; interfere with platform operations; use the platform for harmful or abusive conduct; or fault the policies of the platform.",
      },
      {
        h: "6. Escrow Payment System",
        p: "All buyer payments are held in escrow until the buyer confirms satisfactory delivery. Funds are released to vendors only after confirmation. Payments must follow approved payment processes.",
      },
      {
        h: "7. Vendor Responsibilities",
        p: "Vendors are responsible for providing accurate product descriptions and pricing, ensuring products meet expected quality standards, and fulfilling orders in a timely manner. O-Fash Markett may suspend vendors or listings that violate platform standards after consistent warnings.",
      },
      {
        h: "8. Rider Responsibilities",
        p: "Riders are responsible for handling deliveries professionally and safely, providing accurate delivery updates, and protecting customer orders during transit. Riders are independent contractors.",
      },
      {
        h: "9. Transactions and Dispute Resolution",
        p: "O-Fash Markett is bound to facilitate transactions but is not responsible for disputes arising directly between buyers, vendors, or riders beyond reasonable platform support efforts. However, we will deploy all means and effort to ensure good conflict resolution.",
      },
      {
        h: "10. Intellectual Property",
        p: "All platform content including the O-Fash Markett name, logo, designs, text, and digital materials are the intellectual property of O-Fash Markett and may not be copied or used without permission.",
      },
      {
        h: "11. Limitation of Liability",
        p: "O-Fash Markett provides the platform 'as available' and does not guarantee uninterrupted or error-free service. We are not liable for delays in delivery, vendor product issues, losses resulting from user misconduct, or technical interruptions beyond reasonable control.",
      },
      {
        h: "12. Suspension and Termination",
        p: "O-Fash Markett reserves the right to suspend or terminate user access at any time if these Terms are violated. Users may appeal suspension decisions by contacting support.",
      },
      {
        h: "13. Changes to Terms",
        p: "We may update these Terms of Service periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.",
      },
      {
        h: "14. Governing Law",
        p: "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are resolved through binding arbitration in Lagos, Nigeria.",
      },
      {
        h: "15. Contact Information",
        p: "For questions regarding these Terms of Service, contact O-Fash Markett at contact@o-fashmarkett.com through official communication channels.",
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    sections: [
      {
        h: "1. Introduction",
        p: "This Cookie Policy explains how O-Fash Markett uses cookies and similar technologies when users access our website or platform. By continuing to use O-Fash Markett, you agree to the use of cookies as described in this policy.",
      },
      {
        h: "2. What Are Cookies?",
        p: "Cookies are small data files stored on your device when you visit a website or use an application. They help improve functionality, remember preferences, and enhance user experience.",
      },
      {
        h: "3. How We Use Cookies",
        p: "O-Fash Markett may use cookies to keep you signed into your accounts, remember user preferences and settings, improve platform performance and functionality, analyze platform traffic and usage patterns, support search navigation and recommendations, and enhance security and prevent fraudulent activity.",
      },
      {
        h: "4. Essential Cookies",
        p: "These cookies are necessary for the platform to function properly, including login, navigation, and security features. They are critical to platform operation.",
      },
      {
        h: "5. Performance and Analytics Cookies",
        p: "These cookies help us understand how users interact with the platform so we can improve performance and user experience. They collect data about how you use our services.",
      },
      {
        h: "6. Functional Cookies",
        p: "These cookies remember user preferences such as language, location, and personalized settings, allowing us to provide a more tailored experience.",
      },
      {
        h: "7. Third-Party Services",
        p: "Some cookies may be provided by trusted third-party services used for analytics, payment processing, or platform functionality. These third parties may collect limited information in accordance with their own privacy policies.",
      },
      {
        h: "8. Managing Cookies",
        p: "You can control or disable cookies through your browser or device settings. However, disabling certain cookies may affect platform functionality and user experience. Most browsers allow you to refuse cookies or alert you when cookies are being sent.",
      },
      {
        h: "9. Updates to This Policy",
        p: "O-Fash Markett may update this Cookie Policy from time to time. Continued use of the platform after updates means acceptance of the revised policy.",
      },
      {
        h: "10. Contact Us",
        p: "For questions regarding this Cookie Policy, contact O-Fash Markett at contact@o-fashmarkett.com through official communication channels.",
      },
    ],
  },
};
