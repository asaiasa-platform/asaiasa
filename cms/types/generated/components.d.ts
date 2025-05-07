import type { Schema, Struct } from '@strapi/strapi';

export interface AboutRichTextSection extends Struct.ComponentSchema {
  collectionName: 'components_about_rich_text_sections';
  info: {
    description: 'Rich text section with section type';
    displayName: 'Rich Text Section';
    icon: 'align-justify';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    section_type: Schema.Attribute.Enumeration<
      ['WhoWeAre', 'Vision', 'Mission', 'WhyWeDo']
    > &
      Schema.Attribute.Required;
  };
}

export interface AboutTeamSection extends Struct.ComponentSchema {
  collectionName: 'components_about_team_sections';
  info: {
    description: 'Section displaying team members';
    displayName: 'Team Section';
    icon: 'users';
  };
  attributes: {
    description: Schema.Attribute.Text;
    team_members: Schema.Attribute.Relation<'oneToMany', 'api::team.team'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutWhatWeDoSection extends Struct.ComponentSchema {
  collectionName: 'components_about_what_we_do_sections';
  info: {
    description: 'Section describing what we do for different audiences';
    displayName: 'What We Do Section';
    icon: 'list';
  };
  options: {
    repeatable: true;
  };
  attributes: {
    audience_type: Schema.Attribute.Enumeration<
      ['Volunteers', 'Organizations', 'Partners']
    > &
      Schema.Attribute.Required;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.rich-text-section': AboutRichTextSection;
      'about.team-section': AboutTeamSection;
      'about.what-we-do-section': AboutWhatWeDoSection;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
