import type { CreatorTestimonial } from "@/types/profile";

type CreatorTestimonialsProps = {
  testimonials: CreatorTestimonial[];
};

export function CreatorTestimonials({ testimonials }: CreatorTestimonialsProps) {
  if (!testimonials.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 bg-white/6 px-6 py-10 text-center text-sm text-white/60">
        No testimonials yet.
      </div>
    );
  }

  return (
    <ul className="space-y-4 rounded-3xl border border-white/12 bg-white/8 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.3)]">
      {testimonials.map((testimonial) => (
        <li
          key={testimonial.id}
          className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/80"
        >
          <p className="italic">&ldquo;{testimonial.quote}&rdquo;</p>
          <p className="mt-3 text-xs font-semibold text-white/60">
            {testimonial.author}
          </p>
        </li>
      ))}
    </ul>
  );
}
