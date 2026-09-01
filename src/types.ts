export type ToolCategory = 
  | 'Audio & Music'
  | 'Marketing & Writing'
  | 'Image & Visual'
  | 'PDF & Documents'
  | 'Media Converters'
  | 'SEO & Analytics'
  | 'Video AI';

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  shortDescription: string;
  icon: string;
  badge?: string;
  tags: string[];
  popular?: boolean;
  isPopular?: boolean;
  inputs: ToolInputField[];
  outputType: 'text' | 'markdown' | 'audio' | 'image' | 'file' | 'analysis' | 'calculator' | 'interactive';
  samplePrompt?: string;
  systemPrompt?: string;
  seoMetadata?: {
    faq?: { question: string; answer: string }[];
  };
}

export interface ToolInputField {
  id: string;
  name?: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'file' | 'toggle' | 'slider';
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: ({ label: string; value: string } | string)[];
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  required?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  subscription_tier: 'free' | 'pro';
  subscription_status: 'active' | 'inactive' | 'trial';
  stripe_customer_id?: string;
  weekly_usage_count: number;
  usage_reset_date: string;
  created_at: string;
  isAdmin?: boolean;
}

export interface ToolExecutionLog {
  id: string;
  user_id: string;
  tool_slug: string;
  tool_name: string;
  executed_at: string;
  status: 'success' | 'failed';
  input_summary?: string;
  output_summary?: string;
}

export interface SmartLink {
  id: string;
  user_id: string;
  short_code: string;
  original_url: string;
  title: string;
  click_count: number;
  created_at: string;
  analytics_data: {
    timestamp: string;
    referrer: string;
    device: string;
    country: string;
    browser: string;
  }[];
}

export interface UsageGuardResult {
  status: 'ALLOWED' | 'BLOCKED';
  remaining?: number | 'UNLIMITED';
  message?: string;
  triggerPaywall?: boolean;
}

export interface SeoMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
  };
  alternates: {
    canonical: string;
  };
}
