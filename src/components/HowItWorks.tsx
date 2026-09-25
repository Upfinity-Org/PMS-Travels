const steps = [
  { title: 'Tell us the trip', copy: 'Call, WhatsApp or send the enquiry form with your route, dates and number of guests.' },
  { title: 'Get a clear fare', copy: 'We suggest the right vehicle and confirm the fare with you before you go.' },
  { title: 'Travel with ease', copy: 'Your driver arrives on time, and our team is on hand if plans change.' },
];

/** A genuine sequence, so numbered steps are appropriate here. */
export function HowItWorks() {
  return (
    <ol className="grid gap-8 md:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="border-t border-black/10 pt-5">
          <span className="font-display text-sm font-bold text-primary">Step {i + 1}</span>
          <h3 className="mt-2 font-display text-xl font-semibold">{step.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{step.copy}</p>
        </li>
      ))}
    </ol>
  );
}
