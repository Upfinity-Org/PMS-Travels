import { PageHero } from '../components/PageHero';
import { SITE } from '../config/site';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Privacy policy', path: '/privacy-policy' },
];

const h2 = 'mt-10 font-display text-2xl font-bold tracking-[-.03em]';

export function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How P.M.S Tours & Travels collects, uses and protects the details you send through our website enquiry form."
        path="/privacy-policy"
        jsonLd={[breadcrumbSchema(crumbs)]}
      />
      <PageHero eyebrow="LEGAL" title="Privacy policy" intro={<p>Last updated: 21 September 2026</p>} crumbs={crumbs} compact />
      <section className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
        <div className="prose-copy max-w-none">
          <p>
            This policy explains what personal information {SITE.name} (“we”, “us”) collects through this website, why we collect it and what we do with it.
          </p>

          <h2 className={h2}>What we collect</h2>
          <p>
            When you send an enquiry we collect the details you type into the form: your name, phone number, optional email address, the type of trip, vehicle
            preference, pickup and destination, travel date, number of guests and any message. To protect the form from spam we also process technical
            information such as your IP address, kept only in a hashed form.
          </p>

          <h2 className={h2}>How we use it</h2>
          <p>
            We use your details to reply to your enquiry, suggest a vehicle, confirm a fare and arrange your trip. We do not sell your information and we do
            not use it for advertising.
          </p>

          <h2 className={h2}>Where it goes</h2>
          <p>
            Your enquiry is emailed to our travel team and stored on our own server so that it is not lost. We do not use third-party form, analytics or
            advertising services on this website. Some photographs are loaded from the Unsplash image network, so your browser contacts their servers to fetch
            those pictures. If you contact us through WhatsApp or Instagram, those services’ own privacy policies apply.
          </p>

          <h2 className={h2}>Cookies</h2>
          <p>This website does not set tracking or advertising cookies.</p>

          <h2 className={h2}>How long we keep it</h2>
          <p>We keep enquiries only for as long as we need them to handle your request, run your trip and meet any legal or accounting obligations.</p>

          <h2 className={h2}>Your choices</h2>
          <p>
            You can ask us to show you, correct or delete the personal information you have given us. Call us on{' '}
            <a href={`tel:${SITE.phone.tel}`} className="font-semibold text-primary underline">
              {SITE.phone.display}
            </a>
            {SITE.email ? (
              <>
                {' '}
                or email{' '}
                <a href={`mailto:${SITE.email}`} className="font-semibold text-primary underline">
                  {SITE.email}
                </a>
              </>
            ) : null}{' '}
            and we will respond as soon as we can.
          </p>

          <h2 className={h2}>Changes to this policy</h2>
          <p>If we change how we handle personal information we will update this page and the date above.</p>
        </div>
      </section>
    </>
  );
}
