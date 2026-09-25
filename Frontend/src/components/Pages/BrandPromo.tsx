
import React, { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   TYPES
========================================================= */

interface FormData {
  businessName: string;
  natureOfBusiness: string;
  contact: string;
  email: string;
  address: string;
  description: string;
  logo: File | null;
}

interface FormErrors {
  businessName?: string;
  natureOfBusiness?: string;
  contact?: string;
  email?: string;
  address?: string;
  description?: string;
  logo?: string;
}

/* =========================================================
   COMPONENT
========================================================= */

const BrandPromo: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =======================================================
     STATES
  ======================================================= */

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    natureOfBusiness: "",
    contact: "",
    email: "",
    address: "",
    description: "",
    logo: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /* =======================================================
     LOGO HANDLING
  ======================================================= */

  const handleLogo = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        logo: "Please upload a valid image file.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: "Logo size should be less than 5MB.",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      logo: file,
    }));

    setErrors((prev) => ({
      ...prev,
      logo: "",
    }));

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleLogo(file);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =======================================================
     DRAG & DROP
  ======================================================= */

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleLogo(file);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }

    if (!formData.natureOfBusiness) {
      newErrors.natureOfBusiness = "Please select your business type.";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.contact)) {
      newErrors.contact = "Please enter a valid contact number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Business address is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please tell us about your business.";
    } else if (formData.description.trim().length < 30) {
      newErrors.description =
        "Description should be at least 30 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    /*
      API CALL WILL GO HERE

      Example:

      const data = new FormData();

      data.append("businessName", formData.businessName);
      data.append("natureOfBusiness", formData.natureOfBusiness);
      data.append("contact", formData.contact);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("description", formData.description);

      if (formData.logo) {
        data.append("logo", formData.logo);
      }

      await fetch("/api/brand-promo", {
        method: "POST",
        body: data,
      });
    */

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#05020d] text-white">
        {/* Background */}

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[140px]" />

          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12">
          <div
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-8
              text-center
              shadow-2xl
              backdrop-blur-2xl
              sm:p-12
            "
          >
            <div
              className="
                mx-auto
                mb-7
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-purple-500
                to-fuchsia-600
                shadow-lg
                shadow-purple-900/40
              "
            >
              <CheckCircle2 size={42} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-purple-400">
              Submission Received
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              Your brand is ready to shine!
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/60 sm:text-base">
              Thanks for sharing your business details with
              AdsPromoHub. Our team will review your information
              and get back to you soon.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                mt-8
                inline-flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-600
                px-6
                font-semibold
                shadow-lg
                shadow-purple-900/30
                transition
                hover:-translate-y-0.5
              "
            >
              Back to Home
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#05020d] text-white">
      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute
            left-[-12%]
            top-[-10%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-purple-700/20
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-12%]
            top-[25%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-fuchsia-600/10
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            bottom-[-15%]
            left-[30%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-purple-500/10
            blur-[150px]
          "
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.10),transparent_40%)]" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          relative
          z-20
          border-b
          border-white/[0.06]
          bg-black/20
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-4
            sm:px-8
            lg:px-10
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              group
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-white/60
              transition
              hover:text-white
            "
          >
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-white/[0.04]
                transition
                group-hover:border-purple-400/40
                group-hover:bg-purple-500/10
              "
            >
              <ArrowLeft size={17} />
            </span>

            Back
          </button>

          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-gradient-to-br
                from-purple-500
                to-fuchsia-600
                shadow-lg
                shadow-purple-900/30
              "
            >
              <Sparkles size={17} />
            </div>

            <span className="hidden text-sm font-bold sm:block">
              AdsPromo<span className="text-purple-400">Hub</span>
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        {/* ===================================================
            TOP HEADING
        =================================================== */}

        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-purple-400/20
              bg-purple-500/10
              px-4
              py-2
              text-xs
              font-semibold
              text-purple-300
            "
          >
            <Sparkles size={14} />
            Promote Your Business
          </div>

          <h1
            className="
              text-4xl
              font-black
              leading-tight
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
          >
            Put your brand
            <br />

            <span
              className="
                bg-gradient-to-r
                from-purple-300
                via-fuchsia-400
                to-white
                bg-clip-text
                text-transparent
              "
            >
              in the spotlight.
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-white/55
              sm:text-base
            "
          >
            Tell us about your business and let AdsPromoHub
            help you reach the right audience with powerful
            promotional opportunities.
          </p>
        </div>

        {/* ===================================================
            TWO COLUMN LAYOUT
        =================================================== */}

        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.4fr] lg:gap-10">
          {/* =================================================
              LEFT INFO PANEL
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.04]
              p-6
              backdrop-blur-2xl
              sm:p-8
              lg:p-9
            "
          >
            {/* Decorative glow */}

            <div className="absolute right-[-80px] top-[-80px] h-52 w-52 rounded-full bg-purple-600/20 blur-[80px]" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[3px] text-purple-400">
                Why AdsPromoHub?
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                Give your business
                <br />
                the attention it deserves.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/50">
                Create a strong presence and showcase your business
                to people who are looking for what you offer.
              </p>

              {/* Benefits */}

              <div className="mt-8 space-y-5">
                {[
                  {
                    title: "Reach More Customers",
                    text: "Showcase your business to a wider audience.",
                  },
                  {
                    title: "Build Your Brand",
                    text: "Create a memorable presence for your business.",
                  },
                  {
                    title: "Simple Promotion",
                    text: "Share your details once and let us handle the rest.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4"
                  >
                    <div
                      className="
                        mt-0.5
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-purple-400/20
                        bg-purple-500/10
                        text-purple-300
                      "
                    >
                      <Check size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-white/40">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Small CTA card */}

              <div
                className="
                  mt-9
                  rounded-2xl
                  border
                  border-purple-400/10
                  bg-gradient-to-br
                  from-purple-500/10
                  to-fuchsia-500/5
                  p-5
                "
              >
                <div className="flex items-center gap-3">
                  <Globe2
                    size={20}
                    className="text-purple-400"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Grow beyond your location
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Make your business easier to discover.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.045]
              p-5
              shadow-2xl
              backdrop-blur-2xl
              sm:p-8
              lg:p-9
            "
          >
            {/* Form heading */}

            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-500/10
                    text-purple-400
                  "
                >
                  <Building2 size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Business Details
                  </h2>

                  <p className="text-xs text-white/40">
                    Fill in your business information below.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                LOGO UPLOAD
            ================================================= */}

            <div className="mb-7">
              <label className="mb-2.5 block text-sm font-semibold">
                Company Logo
                <span className="ml-1 text-white/30">
                  (Optional)
                </span>
              </label>

              {!logoPreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    group
                    relative
                    cursor-pointer
                    rounded-2xl
                    border
                    border-dashed
                    p-6
                    text-center
                    transition
                    duration-300
                    ${
                      isDragging
                        ? "border-purple-400 bg-purple-500/10"
                        : "border-white/15 bg-black/10 hover:border-purple-400/40 hover:bg-purple-500/[0.04]"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-purple-500/10
                      text-purple-400
                      transition
                      group-hover:scale-105
                    "
                  >
                    <ImagePlus size={25} />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    Drop your logo here
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    or click to browse
                  </p>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/25">
                    <Upload size={12} />
                    PNG, JPG, WEBP • Max 5MB
                  </div>
                </div>
              ) : (
                <div
                  className="
                    relative
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-purple-400/20
                    bg-purple-500/[0.06]
                    p-4
                  "
                >
                  <img
                    src={logoPreview}
                    alt="Business logo preview"
                    className="
                      h-16
                      w-16
                      rounded-xl
                      border
                      border-white/10
                      object-cover
                    "
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {formData.logo?.name}
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Logo uploaded successfully
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeLogo}
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-500/10
                      text-red-400
                      transition
                      hover:bg-red-500/20
                    "
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

              {errors.logo && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.logo}
                </p>
              )}
            </div>

            {/* =================================================
                BUSINESS NAME + NATURE
            ================================================= */}

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Business Name */}

              <div>
                <label
                  htmlFor="businessName"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  Business Name
                  <span className="ml-1 text-red-400">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                    "
                  />

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                    className={`
                      h-12
                      w-full
                      rounded-xl
                      border
                      bg-black/20
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:bg-purple-500/[0.04]
                      ${
                        errors.businessName
                          ? "border-red-400/50"
                          : "border-white/10 focus:border-purple-400/50"
                      }
                    `}
                  />
                </div>

                {errors.businessName && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Nature */}

              <div>
                <label
                  htmlFor="natureOfBusiness"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  Nature of Business
                  <span className="ml-1 text-red-400">*</span>
                </label>

                <select
                  id="natureOfBusiness"
                  name="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={handleChange}
                  className={`
                    h-12
                    w-full
                    rounded-xl
                    border
                    bg-[#10091b]
                    px-4
                    text-sm
                    outline-none
                    transition
                    focus:border-purple-400/50
                    ${
                      formData.natureOfBusiness
                        ? "text-white"
                        : "text-white/25"
                    }
                    ${
                      errors.natureOfBusiness
                        ? "border-red-400/50"
                        : "border-white/10"
                    }
                  `}
                >
                  <option value="">
                    Select business type
                  </option>

                  <option value="retail">Retail</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="restaurant">Restaurant / Food</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="travel">Travel & Tourism</option>
                  <option value="fashion">Fashion & Lifestyle</option>
                  <option value="automotive">Automotive</option>
                  <option value="services">Professional Services</option>
                  <option value="other">Other</option>
                </select>

                {errors.natureOfBusiness && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.natureOfBusiness}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                CONTACT + EMAIL
            ================================================= */}

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* Contact */}

              <div>
                <label
                  htmlFor="contact"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  Contact Number
                  <span className="ml-1 text-red-400">*</span>
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                    "
                  />

                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`
                      h-12
                      w-full
                      rounded-xl
                      border
                      bg-black/20
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:bg-purple-500/[0.04]
                      ${
                        errors.contact
                          ? "border-red-400/50"
                          : "border-white/10 focus:border-purple-400/50"
                      }
                    `}
                  />
                </div>

                {errors.contact && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.contact}
                  </p>
                )}
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-semibold"
                >
                  Business Email
                  <span className="ml-1 text-red-400">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/30
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hello@yourbusiness.com"
                    className={`
                      h-12
                      w-full
                      rounded-xl
                      border
                      bg-black/20
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:bg-purple-500/[0.04]
                      ${
                        errors.email
                          ? "border-red-400/50"
                          : "border-white/10 focus:border-purple-400/50"
                      }
                    `}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                ADDRESS
            ================================================= */}

            <div className="mt-5">
              <label
                htmlFor="address"
                className="mb-2.5 block text-sm font-semibold"
              >
                Business Address
                <span className="ml-1 text-red-400">*</span>
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-4
                    text-white/30
                  "
                />

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your complete business address"
                  className={`
                    min-h-[105px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    bg-black/20
                    py-3.5
                    pl-11
                    pr-4
                    text-sm
                    leading-6
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/25
                    focus:bg-purple-500/[0.04]
                    ${
                      errors.address
                        ? "border-red-400/50"
                        : "border-white/10 focus:border-purple-400/50"
                    }
                  `}
                />
              </div>

              {errors.address && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.address}
                </p>
              )}
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="mt-5">
              <div className="mb-2.5 flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold"
                >
                  About Your Business
                  <span className="ml-1 text-red-400">*</span>
                </label>

                <span className="text-[11px] text-white/30">
                  {formData.description.length}/500
                </span>
              </div>

              <div className="relative">
                <FileText
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-4
                    text-white/30
                  "
                />

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      handleChange(e);
                    }
                  }}
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us about your business, products, services and what makes your brand special..."
                  className={`
                    w-full
                    resize-none
                    rounded-xl
                    border
                    bg-black/20
                    py-3.5
                    pl-11
                    pr-4
                    text-sm
                    leading-6
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/25
                    focus:bg-purple-500/[0.04]
                    ${
                      errors.description
                        ? "border-red-400/50"
                        : "border-white/10 focus:border-purple-400/50"
                    }
                  `}
                />
              </div>

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            {/* =================================================
                PRIVACY NOTE
            ================================================= */}

            <div
              className="
                mt-6
                flex
                gap-3
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                p-4
              "
            >
              <UserRound
                size={17}
                className="mt-0.5 shrink-0 text-purple-400"
              />

              <p className="text-[11px] leading-5 text-white/35">
                By submitting this form, you confirm that the
                information provided is accurate and can be used
                to contact you regarding promotional opportunities.
              </p>
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                group
                mt-6
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                via-purple-600
                to-fuchsia-600
                text-sm
                font-bold
                shadow-xl
                shadow-purple-900/30
                transition
                duration-300
                hover:-translate-y-0.5
                hover:shadow-purple-700/30
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <>
                  <span
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Submitting...
                </>
              ) : (
                <>
                  Submit Business Details

                  <ArrowRight
                    size={19}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          relative
          z-10
          border-t
          border-white/[0.06]
          px-5
          py-6
          text-center
          sm:px-8
        "
      >
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} AdsPromoHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default BrandPromo;

