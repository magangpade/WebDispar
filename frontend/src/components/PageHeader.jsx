import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BREADCRUMB_TRANS, BADGE_TRANS, TITLE_TRANS } from '../utils/translations';

const PageHeader = ({
  badge = 'Dinas Pariwisata Provinsi Sulawesi Tengah',
  badgeIcon: BadgeIcon = Sparkles,
  title,
  subtitle,
  breadcrumbs = [],
  children,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const displayBadge = isEn && BADGE_TRANS?.EN?.[badge] ? BADGE_TRANS.EN[badge] : badge;
  const displayTitle = isEn && TITLE_TRANS?.EN?.[title]?.title ? TITLE_TRANS.EN[title].title : title;
  const displaySubtitle = isEn && TITLE_TRANS?.EN?.[title]?.subtitle ? TITLE_TRANS.EN[title].subtitle : subtitle;

  return (
    <div
      className="py-12 lg:py-16 text-white relative overflow-hidden transition-colors duration-300"
      style={{ background: 'var(--theme-gradient, linear-gradient(to right, #1F5BA6, #383087, #5C2180))' }}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        {/* Badge */}
        {displayBadge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-amber-300 mb-4 border border-white/20">
            {BadgeIcon && <BadgeIcon size={14} className="text-amber-300 flex-shrink-0" />}
            <span>{displayBadge}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight text-white">
          {displayTitle}
        </h1>

        {/* Subtitle */}
        {displaySubtitle && (
          <p className="text-white/80 mt-3 max-w-3xl text-sm lg:text-base leading-relaxed">
            {displaySubtitle}
          </p>
        )}

          {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav data-tour="page-breadcrumb" aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs text-white/70 mt-6 font-medium">
            <Link to="/" className="hover:text-amber-300 transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const label = isEn && BREADCRUMB_TRANS?.EN?.[crumb.label] ? BREADCRUMB_TRANS.EN[crumb.label] : crumb.label;

              return (
                <React.Fragment key={idx}>
                  <ChevronRight size={12} className="text-white/50 flex-shrink-0" />
                  {crumb.path && !isLast ? (
                    <Link to={crumb.path} className="hover:text-amber-300 transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-amber-300 font-semibold">{label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Optional Extra Elements */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
