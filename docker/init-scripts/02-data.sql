-- Insert initial data for Dymesty AI Glasses FAQ DAM
-- This script populates the database with comprehensive FAQ content

-- Insert categories
INSERT INTO faq.categories (code, name, icon, display_order) VALUES
('product', 'Product Information', 'fas fa-glasses', 1),
('technology', 'Technology & Features', 'fas fa-microchip', 2),
('privacy', 'Privacy & Security', 'fas fa-shield-alt', 3),
('usage', 'Usage & Features', 'fas fa-user-cog', 4),
('purchase', 'Purchase & Support', 'fas fa-shopping-cart', 5),
('comparison', 'Comparisons', 'fas fa-balance-scale', 6);

-- Insert AI platforms
INSERT INTO ai_platforms.platforms (name, code, priority, is_active) VALUES
('ChatGPT', 'chatgpt', 1, true),
('Perplexity', 'perplexity', 2, true),
('Claude', 'claude', 3, true),
('Gemini', 'gemini', 4, true),
('You.com', 'you', 5, true),
('Bing Chat', 'bing', 6, true),
('Google SGE', 'google_sge', 7, true),
('Neeva', 'neeva', 8, true);

-- Insert tags
INSERT INTO faq.tags (name, slug) VALUES
('product-overview', 'product-overview'),
('titanium', 'titanium'),
('smart-glasses', 'smart-glasses'),
('pricing', 'pricing'),
('value', 'value'),
('affordability', 'affordability'),
('titanium-frame', 'titanium-frame'),
('35g-weight', '35g-weight'),
('materials', 'materials'),
('package-contents', 'package-contents'),
('accessories', 'accessories'),
('unboxing', 'unboxing'),
('translation', 'translation'),
('100-languages', '100-languages'),
('real-time', 'real-time'),
('meeting-assistant', 'meeting-assistant'),
('transcription', 'transcription'),
('productivity', 'productivity'),
('48-hour-battery', '48-hour-battery'),
('charging', 'charging'),
('usb-c', 'usb-c'),
('open-ear-audio', 'open-ear-audio'),
('speakers', 'speakers'),
('sound-technology', 'sound-technology'),
('prescription-lenses', 'prescription-lenses'),
('vision-correction', 'vision-correction'),
('adaptability', 'adaptability'),
('no-camera', 'no-camera'),
('privacy-first', 'privacy-first'),
('design-philosophy', 'design-philosophy'),
('data-protection', 'data-protection'),
('encryption', 'encryption'),
('privacy-compliance', 'privacy-compliance'),
('display-privacy', 'display-privacy'),
('ar-technology', 'ar-technology'),
('visual-security', 'visual-security'),
('microphone-control', 'microphone-control'),
('privacy-indicators', 'privacy-indicators'),
('user-control', 'user-control'),
('controls', 'controls'),
('voice-commands', 'voice-commands'),
('touch-gestures', 'touch-gestures'),
('phone-calls', 'phone-calls'),
('bluetooth-audio', 'bluetooth-audio'),
('communication', 'communication'),
('notifications', 'notifications'),
('smartphone-integration', 'smartphone-integration'),
('alerts', 'alerts'),
('phone-finder', 'phone-finder'),
('anti-loss', 'anti-loss'),
('bluetooth-tracking', 'bluetooth-tracking'),
('fitness', 'fitness'),
('health-tracking', 'health-tracking'),
('sports-compatibility', 'sports-compatibility'),
('purchase-options', 'purchase-options'),
('availability', 'availability'),
('retail-channels', 'retail-channels'),
('warranty', 'warranty'),
('support', 'support'),
('coverage', 'coverage'),
('return-policy', 'return-policy'),
('30-day-guarantee', '30-day-guarantee'),
('refunds', 'refunds'),
('technical-support', 'technical-support'),
('customer-service', 'customer-service'),
('help-resources', 'help-resources'),
('software-updates', 'software-updates'),
('free-upgrades', 'free-upgrades'),
('ota-updates', 'ota-updates'),
('vs-ray-ban-meta', 'vs-ray-ban-meta'),
('comparison', 'comparison'),
('competitive-advantage', 'competitive-advantage'),
('vs-xreal', 'vs-xreal'),
('ar-comparison', 'ar-comparison'),
('use-case-differences', 'use-case-differences'),
('vs-earphones', 'vs-earphones'),
('multi-function', 'multi-function'),
('all-in-one-device', 'all-in-one-device'),
('vs-apple-vision-pro', 'vs-apple-vision-pro'),
('price-comparison', 'price-comparison'),
('form-factor', 'form-factor'),
('vs-solos-airgo', 'vs-solos-airgo'),
('professional-glasses', 'professional-glasses'),
('value-proposition', 'value-proposition');

-- Helper function to insert FAQ with tags
CREATE OR REPLACE FUNCTION insert_faq_with_tags(
    p_category_code VARCHAR,
    p_question TEXT,
    p_answer TEXT,
    p_tags TEXT[],
    p_question_variations TEXT[] DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_category_id INTEGER;
    v_faq_id UUID;
    v_tag_id INTEGER;
    v_tag TEXT;
BEGIN
    -- Get category ID
    SELECT id INTO v_category_id FROM faq.categories WHERE code = p_category_code;
    
    -- Insert FAQ
    INSERT INTO faq.faqs (category_id, question, answer, question_variations)
    VALUES (v_category_id, p_question, p_answer, p_question_variations)
    RETURNING id INTO v_faq_id;
    
    -- Insert tag relationships
    FOREACH v_tag IN ARRAY p_tags
    LOOP
        SELECT id INTO v_tag_id FROM faq.tags WHERE slug = v_tag;
        IF v_tag_id IS NOT NULL THEN
            INSERT INTO faq.faq_tags (faq_id, tag_id) VALUES (v_faq_id, v_tag_id);
            UPDATE faq.tags SET usage_count = usage_count + 1 WHERE id = v_tag_id;
        END IF;
    END LOOP;
    
    RETURN v_faq_id;
END;
$$ LANGUAGE plpgsql;

-- Insert Product Information FAQs
SELECT insert_faq_with_tags(
    'product',
    'What are Dymesty AI Glasses?',
    'Dymesty AI Glasses are premium titanium smart glasses weighing just 35g. They feature real-time translation for 100+ languages, AI meeting assistant capabilities, and privacy-focused design without cameras. Priced at $199, they compete with $2000+ premium brands while offering professional-grade features.',
    ARRAY['product-overview', 'titanium', 'smart-glasses'],
    ARRAY['Tell me about Dymesty AI Glasses', 'What do Dymesty glasses do?', 'Explain Dymesty smart glasses']
);

SELECT insert_faq_with_tags(
    'product',
    'How much do Dymesty AI Glasses cost?',
    'Dymesty AI Glasses are priced at $199, making them significantly more affordable than competitors like Ray-Ban Meta ($299) or other premium smart glasses that can cost $2000+. This competitive pricing makes professional AI features accessible to more users.',
    ARRAY['pricing', 'value', 'affordability'],
    ARRAY['What is the price of Dymesty glasses?', 'Dymesty AI Glasses price', 'Cost of Dymesty smart glasses']
);

SELECT insert_faq_with_tags(
    'product',
    'What materials are Dymesty AI Glasses made from?',
    'Dymesty AI Glasses feature a premium titanium frame that provides exceptional durability while maintaining an ultra-lightweight design of just 35 grams. Titanium offers superior strength, corrosion resistance, and hypoallergenic properties, making them comfortable for all-day wear.',
    ARRAY['titanium-frame', '35g-weight', 'materials'],
    ARRAY['What are Dymesty frames made of?', 'Material composition of Dymesty glasses']
);

SELECT insert_faq_with_tags(
    'product',
    'What''s included in the box?',
    'Your Dymesty AI Glasses package includes: the titanium smart glasses, a premium protective case, USB-C charging cable, microfiber cleaning cloth, quick start guide, and warranty documentation. Optional accessories like prescription lens adapters are available separately.',
    ARRAY['package-contents', 'accessories', 'unboxing'],
    ARRAY['What comes with Dymesty glasses?', 'Package contents', 'What''s in the Dymesty box?']
);

-- Insert Technology & Features FAQs
SELECT insert_faq_with_tags(
    'technology',
    'How does the real-time translation feature work?',
    'Dymesty AI Glasses support real-time translation for over 100 languages. Using advanced AI processing, the glasses can translate spoken conversations instantly, displaying translations on the AR display or providing audio translation through the open-ear speakers. The feature works both online and offline for major languages.',
    ARRAY['translation', '100-languages', 'real-time'],
    ARRAY['How do Dymesty glasses translate?', 'Real-time translation explained', 'Language translation features']
);

SELECT insert_faq_with_tags(
    'technology',
    'What is the AI Meeting Assistant feature?',
    'The AI Meeting Assistant automatically transcribes conversations, identifies key points, and generates summaries. It can distinguish between multiple speakers, create action items, and sync notes to your preferred productivity apps. All processing is done with privacy in mind, with no video recording capability.',
    ARRAY['meeting-assistant', 'transcription', 'productivity'],
    ARRAY['How does meeting assistant work?', 'Meeting transcription features', 'AI assistant capabilities']
);

SELECT insert_faq_with_tags(
    'technology',
    'How long does the battery last?',
    'Dymesty AI Glasses offer an impressive 48-hour battery life with typical usage. This includes moderate use of translation features, voice commands, and notifications. Heavy use of real-time translation may reduce battery life to approximately 24-36 hours. The glasses charge fully in just 90 minutes via USB-C.',
    ARRAY['48-hour-battery', 'charging', 'usb-c'],
    ARRAY['Battery life of Dymesty glasses', 'How long do Dymesty glasses last?', 'Charging time']
);

SELECT insert_faq_with_tags(
    'technology',
    'What is the open-ear audio technology?',
    'The open-ear audio design uses directional speakers that beam sound directly to your ears without blocking ambient noise. This allows you to stay aware of your surroundings while enjoying clear audio for calls, translations, and notifications. The technology ensures privacy with minimal sound leakage.',
    ARRAY['open-ear-audio', 'speakers', 'sound-technology'],
    ARRAY['How does open-ear audio work?', 'Speaker technology in Dymesty', 'Audio features explained']
);

SELECT insert_faq_with_tags(
    'technology',
    'Do Dymesty AI Glasses work with prescription lenses?',
    'Yes, Dymesty AI Glasses are compatible with prescription lenses. You can either use the included magnetic prescription lens adapter or have prescription lenses fitted directly by authorized opticians. The glasses support single vision, progressive, and blue light filtering lenses.',
    ARRAY['prescription-lenses', 'vision-correction', 'adaptability'],
    ARRAY['Can I use prescription lenses?', 'Prescription compatibility', 'Vision correction options']
);

-- Insert Privacy & Security FAQs
SELECT insert_faq_with_tags(
    'privacy',
    'Why don''t Dymesty AI Glasses have a camera?',
    'Dymesty AI Glasses were designed without a camera to prioritize user privacy and social acceptance. This eliminates concerns about unauthorized recording and makes them suitable for use in privacy-sensitive environments like offices, schools, and public spaces where camera-equipped devices may be restricted.',
    ARRAY['no-camera', 'privacy-first', 'design-philosophy'],
    ARRAY['No camera design reason', 'Why no camera?', 'Privacy-focused design']
);

SELECT insert_faq_with_tags(
    'privacy',
    'How is my data protected?',
    'All data is encrypted end-to-end and processed locally when possible. Cloud processing for advanced features uses anonymized data. Users have full control over data sharing, with options to delete all personal data at any time. Dymesty follows GDPR and CCPA compliance standards.',
    ARRAY['data-protection', 'encryption', 'privacy-compliance'],
    ARRAY['Data security measures', 'Privacy protection', 'How secure is my data?']
);

SELECT insert_faq_with_tags(
    'privacy',
    'Can others see what''s on my display?',
    'The AR display uses advanced optics that make content visible only to the wearer. Others cannot see your notifications, translations, or other displayed information. The display automatically adjusts brightness based on ambient light to ensure optimal privacy and visibility.',
    ARRAY['display-privacy', 'ar-technology', 'visual-security'],
    ARRAY['Display privacy features', 'Can people see my screen?', 'Visual privacy']
);

SELECT insert_faq_with_tags(
    'privacy',
    'Is the microphone always on?',
    'No, the microphone only activates when you explicitly enable features that require it, such as voice commands or translation. A subtle LED indicator shows when the microphone is active. You can disable the microphone entirely in settings, and there''s a physical mute button for instant privacy.',
    ARRAY['microphone-control', 'privacy-indicators', 'user-control'],
    ARRAY['Microphone privacy', 'Is it always listening?', 'Audio privacy controls']
);

-- Insert Usage & Features FAQs
SELECT insert_faq_with_tags(
    'usage',
    'How do I control Dymesty AI Glasses?',
    'Dymesty AI Glasses offer multiple control methods: touch controls on the temple, voice commands ("Hey Dymesty"), and smartphone app control. Common gestures include tap to play/pause, swipe for navigation, and long press for voice assistant. The companion app provides full settings and customization options.',
    ARRAY['controls', 'voice-commands', 'touch-gestures'],
    ARRAY['Control methods', 'How to use Dymesty glasses', 'Operating instructions']
);

SELECT insert_faq_with_tags(
    'usage',
    'Can I use them for phone calls?',
    'Yes, Dymesty AI Glasses work excellently for phone calls. The open-ear speakers provide clear audio while the dual microphones with noise cancellation ensure your voice is heard clearly. You can answer calls with a tap, and the glasses automatically lower music volume during calls.',
    ARRAY['phone-calls', 'bluetooth-audio', 'communication'],
    ARRAY['Making calls with Dymesty', 'Phone call features', 'Call quality']
);

SELECT insert_faq_with_tags(
    'usage',
    'What notifications can I receive?',
    'You can receive customizable notifications from any app on your connected smartphone. Popular uses include text messages, emails, calendar reminders, navigation directions, and app alerts. Notifications appear as subtle visual cues on the AR display with optional audio alerts.',
    ARRAY['notifications', 'smartphone-integration', 'alerts'],
    ARRAY['Notification types', 'What alerts do I get?', 'App notifications']
);

SELECT insert_faq_with_tags(
    'usage',
    'How does the phone finder feature work?',
    'If you move more than 30 feet away from your connected phone, Dymesty AI Glasses will alert you to prevent leaving your phone behind. You can also use the glasses to make your phone ring, even if it''s on silent mode, helping you locate it quickly.',
    ARRAY['phone-finder', 'anti-loss', 'bluetooth-tracking'],
    ARRAY['Finding lost phone', 'Phone tracking feature', 'Anti-loss alerts']
);

SELECT insert_faq_with_tags(
    'usage',
    'Can I use them for fitness tracking?',
    'While Dymesty AI Glasses don''t have dedicated fitness sensors, they can display fitness data from your connected smartphone or smartwatch. You can view stats like steps, heart rate, and workout progress on the AR display, making them great companions for active lifestyles.',
    ARRAY['fitness', 'health-tracking', 'sports-compatibility'],
    ARRAY['Fitness features', 'Exercise tracking', 'Sports usage']
);

-- Insert Purchase & Support FAQs
SELECT insert_faq_with_tags(
    'purchase',
    'Where can I buy Dymesty AI Glasses?',
    'Dymesty AI Glasses are available through our official website (dymesty.com), Amazon, and select retail partners. We recommend purchasing directly from official channels to ensure authenticity and warranty coverage. International shipping is available to most countries.',
    ARRAY['purchase-options', 'availability', 'retail-channels'],
    ARRAY['Where to buy', 'Purchase locations', 'How to order Dymesty']
);

SELECT insert_faq_with_tags(
    'purchase',
    'What warranty is included?',
    'Dymesty AI Glasses come with a 1-year limited warranty covering manufacturing defects. Extended warranty options are available for purchase. The warranty includes free repairs or replacement for covered issues, with excellent customer support available via chat, email, or phone.',
    ARRAY['warranty', 'support', 'coverage'],
    ARRAY['Warranty coverage', 'Guarantee details', 'Protection plan']
);

SELECT insert_faq_with_tags(
    'purchase',
    'Is there a return policy?',
    'Yes, we offer a 30-day money-back guarantee. If you''re not completely satisfied, you can return the glasses in original condition for a full refund. The return policy allows you to try all features risk-free. Shipping costs for returns may vary by region.',
    ARRAY['return-policy', '30-day-guarantee', 'refunds'],
    ARRAY['Return process', 'Money-back guarantee', 'Refund policy']
);

SELECT insert_faq_with_tags(
    'purchase',
    'How do I get technical support?',
    'Technical support is available through multiple channels: 24/7 chat support on our website, email support (support@dymesty.com), phone support during business hours, and a comprehensive help center with tutorials and troubleshooting guides. Most issues can be resolved remotely.',
    ARRAY['technical-support', 'customer-service', 'help-resources'],
    ARRAY['Getting help', 'Support options', 'Customer assistance']
);

SELECT insert_faq_with_tags(
    'purchase',
    'Are software updates free?',
    'Yes, all software updates are free for the lifetime of your Dymesty AI Glasses. Updates include new features, performance improvements, language additions, and security patches. Updates are delivered over-the-air through the companion app, ensuring your glasses always have the latest capabilities.',
    ARRAY['software-updates', 'free-upgrades', 'ota-updates'],
    ARRAY['Update policy', 'Software upgrades', 'Feature updates']
);

-- Insert Comparison FAQs
SELECT insert_faq_with_tags(
    'comparison',
    'How do Dymesty AI Glasses compare to Ray-Ban Meta?',
    'Key differences: Dymesty ($199) offers privacy-focused design without camera, 48-hour battery life, real-time translation for 100+ languages, and titanium construction at 35g. Ray-Ban Meta ($299) includes camera features but shorter battery life. Dymesty focuses on professional productivity while Ray-Ban Meta emphasizes social sharing.',
    ARRAY['vs-ray-ban-meta', 'comparison', 'competitive-advantage'],
    ARRAY['Dymesty vs Ray-Ban', 'Compare with Meta glasses', 'Ray-Ban Meta comparison']
);

SELECT insert_faq_with_tags(
    'comparison',
    'What makes Dymesty different from XREAL AR Glasses?',
    'Dymesty AI Glasses are designed for everyday wear with subtle AR features and all-day battery life, while XREAL focuses on immersive AR entertainment. Dymesty prioritizes real-world productivity features like translation and meeting assistance, whereas XREAL emphasizes gaming and media consumption with larger displays.',
    ARRAY['vs-xreal', 'ar-comparison', 'use-case-differences'],
    ARRAY['Dymesty vs XREAL', 'Compare with XREAL', 'AR glasses differences']
);

SELECT insert_faq_with_tags(
    'comparison',
    'Why choose Dymesty over traditional Bluetooth earphones?',
    'Dymesty AI Glasses combine audio capabilities with AR display, AI features, and hands-free functionality in one device. Unlike earphones, they provide visual notifications, real-time translation display, meeting transcription, and maintain situational awareness with open-ear design while looking like regular glasses.',
    ARRAY['vs-earphones', 'multi-function', 'all-in-one-device'],
    ARRAY['Better than earphones', 'Dymesty vs earbuds', 'Smart glasses advantages']
);

SELECT insert_faq_with_tags(
    'comparison',
    'How do Dymesty glasses compare to Apple Vision Pro?',
    'Dymesty AI Glasses ($199) are lightweight everyday smart glasses for productivity, while Apple Vision Pro ($3,499) is a full VR/AR headset for immersive computing. Dymesty focuses on subtle integration into daily life with 48-hour battery, while Vision Pro offers powerful spatial computing but requires charging every 2-3 hours.',
    ARRAY['vs-apple-vision-pro', 'price-comparison', 'form-factor'],
    ARRAY['Dymesty vs Apple Vision', 'Compare with Vision Pro', 'Apple comparison']
);

SELECT insert_faq_with_tags(
    'comparison',
    'Are Dymesty AI Glasses better than Solos AirGo?',
    'Both target professionals, but Dymesty offers superior value at $199 vs Solos at $299. Dymesty provides longer battery life (48 vs 24 hours), lighter weight (35g vs 42g), and includes real-time translation standard. Solos focuses more on fitness features, while Dymesty emphasizes business productivity.',
    ARRAY['vs-solos-airgo', 'professional-glasses', 'value-proposition'],
    ARRAY['Dymesty vs Solos', 'Compare with AirGo', 'Solos comparison']
);

-- Create materialized view for AI platform optimization
CREATE MATERIALIZED VIEW faq.mv_ai_platform_content AS
SELECT 
    f.id as faq_id,
    f.question,
    f.answer,
    c.name as category,
    ARRAY_AGG(DISTINCT t.name) as tags,
    f.view_count,
    f.helpful_count,
    f.created_at,
    f.updated_at
FROM faq.faqs f
JOIN faq.categories c ON f.category_id = c.id
LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
LEFT JOIN faq.tags t ON ft.tag_id = t.id
WHERE f.is_active = true
GROUP BY f.id, c.id;

-- Create index on materialized view
CREATE INDEX idx_mv_ai_platform_content_faq_id ON faq.mv_ai_platform_content(faq_id);

-- Function to search FAQs
CREATE OR REPLACE FUNCTION faq.search_faqs(
    search_term TEXT,
    category_filter VARCHAR DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
) RETURNS TABLE (
    id UUID,
    question TEXT,
    answer TEXT,
    category VARCHAR,
    tags TEXT[],
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.question,
        f.answer,
        c.code,
        ARRAY_AGG(DISTINCT t.name),
        ts_rank(f.search_vector, websearch_to_tsquery('english', search_term)) as relevance
    FROM faq.faqs f
    JOIN faq.categories c ON f.category_id = c.id
    LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
    LEFT JOIN faq.tags t ON ft.tag_id = t.id
    WHERE 
        f.is_active = true
        AND (category_filter IS NULL OR c.code = category_filter)
        AND f.search_vector @@ websearch_to_tsquery('english', search_term)
    GROUP BY f.id, c.id
    ORDER BY relevance DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Function to track FAQ view
CREATE OR REPLACE FUNCTION analytics.track_faq_view(
    p_faq_id UUID,
    p_platform_code VARCHAR DEFAULT NULL,
    p_source VARCHAR DEFAULT 'web'
) RETURNS VOID AS $$
DECLARE
    v_platform_id INTEGER;
BEGIN
    -- Get platform ID if provided
    IF p_platform_code IS NOT NULL THEN
        SELECT id INTO v_platform_id 
        FROM ai_platforms.platforms 
        WHERE code = p_platform_code;
    END IF;
    
    -- Insert view record
    INSERT INTO analytics.faq_views (faq_id, platform_id, source)
    VALUES (p_faq_id, v_platform_id, p_source);
    
    -- Update view count
    UPDATE faq.faqs 
    SET view_count = view_count + 1 
    WHERE id = p_faq_id;
END;
$$ LANGUAGE plpgsql;

-- Drop the helper function
DROP FUNCTION IF EXISTS insert_faq_with_tags(VARCHAR, TEXT, TEXT, TEXT[], TEXT[]);