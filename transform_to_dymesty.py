#!/usr/bin/env python3
"""
Transform leapgeo-sys project to Dymesty AI Glasses content
This script updates all HTML files to focus on Dymesty AI Glasses in English
"""

import os
import re
import glob

# Define transformation rules
TRANSFORMATIONS = {
    # Chinese to English translations
    'GEO系统': 'Dymesty AI System',
    'GEO平台': 'Dymesty Platform', 
    'GEO内容资产库': 'Dymesty Content Asset Library',
    'GEO': 'AI Platform',
    '生成式引擎优化': 'AI Platform Optimization',
    'AI能见度指数': 'AI Visibility Index',
    '声量份额': 'Share of Voice',
    
    # Company/Product transformations
    'Leap Company': 'Dymesty',
    'leap公司': 'Dymesty',
    'Eureka': 'Dymesty AI Glasses',
    'robot vacuum': 'AI glasses',
    'vacuum cleaner': 'smart glasses',
    '吸尘器': 'smart glasses',
    '机器人': 'AI assistant',
    
    # Common Chinese UI elements to English
    '渠道诊断': 'Channel Diagnostics',
    '策略规划': 'Strategy Planning',
    '问题收集': 'Question Collection',
    '资产创作': 'Asset Creation',
    '内容编排': 'Content Orchestration',
    '渠道配置': 'Channel Configuration',
    '用户旅程': 'User Journey',
    '实时监控': 'Real-time Monitoring',
    '品牌表现': 'Brand Performance',
    '可见性分析': 'Visibility Analytics',
    '感知分析': 'Perception Analytics',
    '引用分析': 'Citation Analytics',
    '问题分析': 'Question Analytics',
    
    # Navigation and UI elements
    '监控面板': 'Monitoring Dashboard',
    '数据库': 'Database',
    '编排': 'Orchestration',
    '分发': 'Distribution',
    '互动': 'Engagement',
    '监控': 'Monitoring',
    
    # Metrics and indicators
    '覆盖率': 'Coverage Rate',
    '情感得分': 'Sentiment Score',
    '引用率': 'Citation Rate',
    '权威得分': 'Authority Score',
    
    # AI platforms - ensure consistent naming
    'ChatGPT': 'ChatGPT',
    'Perplexity': 'Perplexity',
    'Claude': 'Claude',
    'Gemini': 'Gemini',
    'You.com': 'You.com',
    'Bing Chat': 'Bing Chat',
}

# Additional context-specific transformations for Dymesty AI Glasses
DYMESTY_SPECIFIC = {
    # Product features
    'real-time translation': 'real-time translation',
    'privacy protection': 'privacy protection',
    'battery life': 'battery life',
    'SDK integration': 'SDK integration',
    'developer tools': 'developer tools',
    'AR display': 'AR display',
    
    # Channels relevant to AI glasses
    'Social Media': 'Developer Forums',
    'Review Sites': 'Tech Reviews',
    'E-commerce': 'Product Demos',
    'Video Platforms': 'YouTube Demos',
    'Blogs & Forums': 'GitHub/Docs',
    'Official Sites': 'Official Dymesty',
}

def transform_file(filepath):
    """Transform a single HTML file"""
    print(f"Processing: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply basic transformations
        for old_text, new_text in TRANSFORMATIONS.items():
            content = content.replace(old_text, new_text)
        
        # Apply Dymesty-specific transformations
        for old_text, new_text in DYMESTY_SPECIFIC.items():
            content = content.replace(old_text, new_text)
        
        # Update page titles
        content = re.sub(
            r'<title>[^<]*</title>',
            lambda m: m.group(0).replace('Content Intelligence Center', 'Dymesty AI Glasses Intelligence Center'),
            content
        )
        
        # Update any remaining Chinese characters in common UI elements
        # This is a simplified approach - in production, use proper i18n
        chinese_patterns = [
            (r'确认', 'Confirm'),
            (r'取消', 'Cancel'),
            (r'提交', 'Submit'),
            (r'保存', 'Save'),
            (r'删除', 'Delete'),
            (r'编辑', 'Edit'),
            (r'新建', 'New'),
            (r'搜索', 'Search'),
            (r'返回', 'Back'),
            (r'下一步', 'Next'),
        ]
        
        for chinese, english in chinese_patterns:
            content = re.sub(chinese, english, content)
        
        # Save if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Updated: {filepath}")
        else:
            print(f"  - No changes needed: {filepath}")
            
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")

def main():
    """Main function to process all HTML files"""
    print("Starting Dymesty transformation...")
    print("-" * 50)
    
    # Get all HTML files
    html_files = glob.glob('/Users/cavin/Desktop/leapgeo-sys/*.html')
    
    # Process each file
    for filepath in html_files:
        # Skip already processed files
        if os.path.basename(filepath) in ['login.html', 'index.html', '00a-geo-channel-diagnostic.html']:
            print(f"Skipping already processed: {filepath}")
            continue
            
        transform_file(filepath)
    
    print("-" * 50)
    print("Transformation complete!")
    print("\nNext steps:")
    print("1. Review the transformed files")
    print("2. Update any chart data to reflect Dymesty AI Glasses metrics")
    print("3. Update CLAUDE.md documentation")
    print("4. Commit changes to git")

if __name__ == "__main__":
    main()