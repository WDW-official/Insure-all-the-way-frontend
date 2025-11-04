import Car from "@/assets/svgIcons/Car";
import Health from "@/assets/svgIcons/Health";
import Play from "@/assets/svgIcons/Play";
import Property from "@/assets/svgIcons/Property";
import LetsPlayHeader from "@/container/LetsPlayHeader/LetsPlayHeader";
import ProductHeader from "@/container/ProductHeader/ProductHeader";

export const routes = Object.freeze({
  BASE_URL: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  CONTACT_US: "/contact-us",
  INDIVIDUAL_AND_FAMILY_HMO: "/individual-and-family-hmo",
  CORPORATE_HMO: "/corporate-and-group-hmo",
  THIRD_PARTY_MOTOR_INSURANCE: "/third-party-motor-insurance",
  ENHANCED_THIRD_PARTY_MOTOR_INSURANCE: "/enhanced-third-party-motor-insurance",
  COMPREHENSIVE_MOTOR_INSTRANCE: "/comprehensive-motor-insurance",
  FLEET_MOTOR_INSURANCE: "/fleet-motor-insurance",
  HEALTH_AND_INSURANCE_FRIENDLY_MATCH:
    "/lets-play/health-and-insurance-friendly-match",
  THE_TECH_TITANS: "/lets-play//the-tech-titans",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_AND_CONDITIONS: "/terms-and-conditions",
  HEALTH_INSURANCE: "/health-insurance",
  PROPERTY_INSURANCE: "/property-insurance",
  MOTOR_INSURANCE: "/motor-insurance",
  DASHBOARD: "/dashboard",
  POLICIES: "/policies",
  LETS_PLAY: "/lets-play",
  ALL_RISK: "/all-risk",
  BUILDING: "/building",
  TRACKER: "/dashboard/tracker",
  PROFILE: "/profile/user",
  PROFILE_CHANGE_PASSWORD: "/profile/reset-password",
  CHAT: "/chat",
});

export const headerRoutes = [
  {
    title: "Products",
    isActive: false,
    image: null,
    children: [
      {
        title: "Health Insurance",
        children: [
          {
            title: "Individual & Family HMO",
            route: routes.INDIVIDUAL_AND_FAMILY_HMO,
            icon: <Health color="#d4a5e6" />,
            description:
              "Get a health cover designed to suit your specific needs, and enjoy access to quality healthcare and superior service.",
          },

          {
            title: "Corporate & Group HMO",
            route: routes.CORPORATE_HMO,
            icon: <Health color="#f5b7b1" />,

            description:
              "Providing Quality Health Insurance For Corporate & Small Businesses",
          },
        ],
        route: routes.HEALTH_INSURANCE,
        icon: <Health color="#d4a5e6" />,
        description: null,
        isActive: false,
        image:
          "https://res.cloudinary.com/dfilepe0f/image/upload/v1738947903/Health_Insurance_Hero_Image_txsl9f.svg",
      },
      {
        title: "Motor Insurance",
        isActive: false,
        children: [
          {
            title: "Third Party Motor Insurance",
            route: routes.THIRD_PARTY_MOTOR_INSURANCE,
            icon: <Car color="#1b3a57" />,
            description:
              "Providing Quality Health Insurance For Corporate & Small Businesses",
            isActive: false,
          },

          {
            title: "Enhanced Third Party Motor Insurance",
            route: routes.ENHANCED_THIRD_PARTY_MOTOR_INSURANCE,
            icon: <Car color="#3a506b" />,
            description:
              "Drive confidently with coverage for damage, flood, fire, and theft.",
            isActive: false,
          },
          {
            title: "Comprehensive Motor Insurance",
            route: routes.COMPREHENSIVE_MOTOR_INSTRANCE,
            icon: <Car color="#000000" />,
            description:
              "Comprehensive Motor Insurance covers loss or damage from fire, theft, vandalism, accident, or collision, including legal liability for third-party injury or property damage.",
            isActive: false,
          },
          {
            title: "Fleet Motor Insurance",
            route: routes.FLEET_MOTOR_INSURANCE,
            icon: <Car color="#f8e8a2" />,
            description:
              "With our fleet insurance, you can cover your entire fleet of business vehicles. The policy allows you to insure all vehicles under a single policy rather than separately, and it allows you to either insure all drivers or assign names to all drivers.",
            isActive: false,
          },
        ],
        route: routes.MOTOR_INSURANCE,
        icon: <Car color="#1b3a57" />,
        description: null,
        image:
          "https://res.cloudinary.com/dfilepe0f/image/upload/v1738947903/Car_Insurance_Hero_Image_t3gbim.svg",
      },
      {
        title: "Property Insurance",
        children: [
          {
            title: "Building",
            route: routes.BUILDING,
            icon: <Property color="#1b3a57" />,
            description:
              "Whether it's your home, office, or a rental property, we help you stay protected so you can focus on what matters most.",
            isActive: false,
          },

          {
            title: "All Risks",
            route: routes.ALL_RISK,
            icon: <Property color="#f5b7b1" />,
            description:
              "Your valuable possessions deserve all-round protection, no matter where they are.",
            isActive: false,
          },
        ],
        route: routes.PROPERTY_INSURANCE,
        isActive: false,
        icon: <Property color="#f5b7b1" />,
        description: null,
        image:
          "https://res.cloudinary.com/dx3zrhslt/image/upload/v1747843762/Property_Insurance_qkyaye.svg",
      },
    ],
    route: null,
    component: <ProductHeader />,
  },

  {
    title: "Let's Play",
    route: routes.LETS_PLAY,
    isActive: false,
    component: <LetsPlayHeader />,

    children: [
      {
        title: "Health & Insurance Friendly Match",
        route: routes.HEALTH_AND_INSURANCE_FRIENDLY_MATCH,
        children: null,
        icon: <Play color="#f5b7b1" />,
        description: "",
        image:
          "https://res.cloudinary.com/dfilepe0f/image/upload/v1737384645/samples/ecommerce/car-interior-design.jpg",
        isActive: false,
      },
      {
        title: "The Tech Titans",
        route: routes.THE_TECH_TITANS,
        children: null,
        icon: <Play color="#f8e8a2" />,
        description: "",
        image:
          "https://res.cloudinary.com/dfilepe0f/image/upload/v1737384645/samples/ecommerce/car-interior-design.jpg",
        isActive: false,
      },
    ],
  },

  {
    title: "Contact Us",
    route: routes.CONTACT_US,
    children: null,
    isActive: false,
    component: null,
  },
  {
    title: "Chat with Uju",
    route: routes.CHAT,
    children: null,
    isActive: false,
    component: null,
    properties: ["isAi"],
  },
];

export const dashboardRoutes = [
  {
    title: "Dashboard",
    route: routes.DASHBOARD,
    properties: ["isProtected"],
  },
  {
    title: "Policies",
    route: routes.POLICIES,
    properties: ["isProtected"],
  },
];

export const profileRoutes = [
  {
    title: "Account Information",
    route: routes.PROFILE,
  },
  {
    title: "Reset Password",
    route: routes.PROFILE_CHANGE_PASSWORD,
  },
];
