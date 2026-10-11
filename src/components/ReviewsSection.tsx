import React from 'react';
import { Star, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { CustomerReview } from '../types';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="reviews" className="py-20 bg-[#0a0a0d] border-b border-[#1c1b22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-[#c5a85c] font-semibold mb-2">
            Verified Client Praise
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f3ef] font-normal">
            Trusted by Hundreds in Delhi
          </h2>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center text-[#eab308]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#eab308] text-[#eab308]" />
              ))}
            </div>
            <div className="text-sm text-[#dedad2] font-medium flex items-center gap-2">
              <span className="font-bold text-white text-base">5.0 / 5.0</span>
              <span className="text-[#4e4b55]" aria-hidden="true">·</span>
              <span className="text-[#a49f96]">119+ Reviews on Justdial &amp; Google</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#121117] border border-[#23222d] flex flex-col justify-between hover:border-[#3a3848] transition-all shadow-md text-left"
            >
              <div>
                {/* Header: Stars & Source */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[#eab308]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#eab308] text-[#eab308]" />
                    ))}
                  </div>

                  <span className="text-[11px] text-[#787580] flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-[#c5a85c]" />
                    {rev.source} Verified
                  </span>
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-[#cac5ba] leading-relaxed italic mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Service note */}
              <div className="pt-4 border-t border-[#1d1c25] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#f5f3ef]">{rev.name}</h4>
                  <span className="text-[10px] text-[#716e78]">{rev.date}</span>
                </div>

                {rev.serviceMentioned && (
                  <span className="text-[10px] text-[#c5a85c] font-medium">
                    {rev.serviceMentioned}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight quote banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#15141c] border border-[#292835] text-center max-w-3xl mx-auto space-y-3">
          <MessageSquareQuote className="w-8 h-8 text-[#c5a85c] mx-auto opacity-70" />
          <p className="font-serif text-lg sm:text-xl text-[#f5f3ef] italic">
            &ldquo;Spacious environment, polite and friendly staff, cleanliness, and budget-friendly pricing that genuinely delivers luxury satisfaction.&rdquo;
          </p>
          <div className="text-xs text-[#8c8893]">
            Consistent theme across verified Justdial &amp; Google customer feedback
          </div>
        </div>
      </div>
    </section>
  );
};
