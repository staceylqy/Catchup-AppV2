import { Contact, Task } from '../types';

export const ME_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAj1o6U8YwryGtzSBTjDWdPybJKCW2CYXhWvZmhmoOxsxxCXnnvTbBjA7L2Q-C9yDINdrZ1uNDUcIaWm4VtX-1AXsiAiUH-uaIy0tad1ezHznztpoRWA-KyaGK5sAwlrRVC65diBq343VM3-oTeYvZrcsNmCmKtR-xm3QDjC3YE-JFE_i83uXkQCJEzWI9RRAKRXFUw3pcFKfbmUkZkcZ00G5C2e8Kvlswk3e-b_53Cv5DVayhMk8_CMQtKo2sL1b9BR0c9w_kQGoY";

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: "sarah_chen",
    name: "Sarah Chen",
    role: "Project Manager",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAxqHbt95aSTl5VtIKrQskWifvoR1iZ_4PkcHlnt5ZHvuIV4-oIeeHGm-q_ZvLM50Ff95XJItsRvKeOzx9bY0F9WryrfOVm0We988_FpNZTwjoiezOqp6MyIvG9gT-jb5r5KVCymifv2hbkRp5BA320xVBF042knILLV5WCqJtY5oOEbVdwDhEJ0DRgOCcUijNnc5aL1AWHP-CI8iTopiyvhFoRvb1U08Zgq74pnmhAgqrMBTg38NgGkcOESOnqCW5lT5lMYX_gbo",
    lastMessageTime: "10:24 AM",
    lastMessageText: "I've reviewed the latest figures for Project Zenith. We need to shift approximately $12k from the social media spend into the influencer partnership for the November launch. Can you confirm if this aligns with the overall strategy before I finalize the documents?",
    unread: true,
    priority: "high",
    aiSummary: "AI: Action required. Sarah needs approval on the Q3 marketing shift by EOD.",
    status: "Awaiting Approval",
    sentiment: "Urgent / Collaborative",
    resolutionTime: "Est. 2 hours remaining",
    resolutionProgress: 85,
    keyInsights: [
      "$12k reallocation request",
      "Deadline: 5:00 PM Today",
      "Impact: High risk if delayed"
    ],
    messages: [
      {
        id: "s1",
        senderName: "Sarah Chen",
        senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAxqHbt95aSTl5VtIKrQskWifvoR1iZ_4PkcHlnt5ZHvuIV4-oIeeHGm-q_ZvLM50Ff95XJItsRvKeOzx9bY0F9WryrfOVm0We988_FpNZTwjoiezOqp6MyIvG9gT-jb5r5KVCymifv2hbkRp5BA320xVBF042knILLV5WCqJtY5oOEbVdwDhEJ0DRgOCcUijNnc5aL1AWHP-CI8iTopiyvhFoRvb1U08Zgq74pnmhAgqrMBTg38NgGkcOESOnqCW5lT5lMYX_gbo",
        timestamp: "10:24 AM",
        text: "I've reviewed the latest figures for Project Zenith. We need to shift approximately $12k from the social media spend into the influencer partnership for the November launch. Can you confirm if this aligns with the overall strategy before I finalize the documents?"
      }
    ],
    referencedAssets: [
      {
        id: "asset_zenith_pdf",
        name: "Zenith_Q3_Budget.pdf",
        type: "pdf",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP-aQDmsstI2aCo6fBfD8HakABrbksYio9v-ddjTGMJDQuXBJwXo4nk5SskLseujgpRj10Bpi6Lg3ONjxRWEKcnUv_dSL4cvPIpyuDjESSUGCtWKMbc1FYCppknRGyDfcjNTYkz-9WnX9JA_cVGISktsMuXFC-D4BMri5-oFZNepiP5hS2ZFp_MUCoB29vmzxsfxzVdpHBpNO81cPDOJIn0gQnuV0cf4cO5S90m8gqlV0OwigE-k5AjQ6Q6QSv1siv7E16lb1P2tk",
        description: "Draft of Q3 financial predictions showing shift proposals for Project Zenith."
      },
      {
        id: "asset_influencer_xlsx",
        name: "Influencer_List_Oct24.xlsx",
        type: "xlsx",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOmKJHG5WQM4Vb8fQVQ_RHf3ckfTZo45s9Gwe1AH3eNwY2jDFRbKW6cp28AcYXMgMCy7G7TsQsRrPzKIwtMvebgIhLu3hXZem9XLNmIT9eEUkr0GmF1xccfZk3RMGfo8I5zdDnf_684AopAlFz9VPm_8ZaGBXLtqa-6Kxc8Qji4SGU0l-IM1A4zwHIy03QlUFAJcT07aDbaAohgdbwx7otOE3X9oMhQW0WlHqvl4bkcPqtoKu7tDppyco_RHglGis7_Cz14LkrZR4",
        description: "Curated sheet of influencers, tiers, and cost structures for the November campaign."
      }
    ]
  },
  {
    id: "marcus_aurelius",
    name: "Marcus Aurelius",
    role: "Creative Director",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6sEM9X9JGtjeboGNSKRB0sR4Mv65c5jOe4SjAGyKtPERD7ou7er68lHE4BKtdQMdL945tDdPLsrv52RwCZhecWiOJs-hWnO3fkBLxZYxJlsxCTN8iIAMR3Sh_Glc6rmu1RbP0oRDi8rnji4bNDgr-Mn3RDN9bBxZdkBqKUMBH2kYYJhImfbq8WDygh2TfxEhxIs5hw8DzmzxlLRP1uahNr0LDUqs7p2GfW2L5hqLPBGXShzhwVUMmYDXjGvAHAUHqfqgwwa3PkR0",
    lastMessageTime: "09:15 AM",
    lastMessageText: "Our brand identity guidelines should emphasize deep negative space and high typographic contrast. Have you checked out the latest typography pairing draft in the asset library? Let's aim to simplify rather than add decorative elements.",
    unread: false,
    priority: "medium",
    aiSummary: "AI: Marcus is asking for feedback on the latest brand guidelines draft.",
    status: "Awaiting Feedback",
    sentiment: "Reflective / Insightful",
    resolutionTime: "Est. 24 hours remaining",
    resolutionProgress: 40,
    keyInsights: [
      "Brand typography guidelines draft",
      "Stresses minimalist aesthetic",
      "Action: Feedback requested on style deck"
    ],
    messages: [
      {
        id: "m1",
        senderName: "Marcus Aurelius",
        senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6sEM9X9JGtjeboGNSKRB0sR4Mv65c5jOe4SjAGyKtPERD7ou7er68lHE4BKtdQMdL945tDdPLsrv52RwCZhecWiOJs-hWnO3fkBLxZYxJlsxCTN8iIAMR3Sh_Glc6rmu1RbP0oRDi8rnji4bNDgr-Mn3RDN9bBxZdkBqKUMBH2kYYJhImfbq8WDygh2TfxEhxIs5hw8DzmzxlLRP1uahNr0LDUqs7p2GfW2L5hqLPBGXShzhwVUMmYDXjGvAHAUHqfqgwwa3PkR0",
        timestamp: "09:15 AM",
        text: "Our brand identity guidelines should emphasize deep negative space and high typographic contrast. Have you checked out the latest typography pairing draft in the asset library? Let's aim to simplify rather than add decorative elements."
      }
    ],
    referencedAssets: [
      {
        id: "asset_brand_guidelines",
        name: "Brand_Design_Ethics.pdf",
        type: "pdf",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP-aQDmsstI2aCo6fBfD8HakABrbksYio9v-ddjTGMJDQuXBJwXo4nk5SskLseujgpRj10Bpi6Lg3ONjxRWEKcnUv_dSL4cvPIpyuDjESSUGCtWKMbc1FYCppknRGyDfcjNTYkz-9WnX9JA_cVGISktsMuXFC-D4BMri5-oFZNepiP5hS2ZFp_MUCoB29vmzxsfxzVdpHBpNO81cPDOJIn0gQnuV0cf4cO5S90m8gqlV0OwigE-k5AjQ6Q6QSv1siv7E16lb1P2tk",
        description: "Ethical guidelines on minimal typography and spacious layout principles."
      }
    ]
  },
  {
    id: "design_sync",
    name: "Design Sync Team",
    role: "Workspace Channel",
    avatar: "group_avatar", // Will be rendered with group icon
    lastMessageTime: "Yesterday",
    lastMessageText: "We have updated the design tokens in Figma and the layout has been finalized for the multi-view component. 12 messages from various designers discussing pixel borders.",
    unread: false,
    priority: "low",
    aiSummary: "AI: Summary of 12 messages about the icon library migration.",
    status: "Processed / Filed",
    sentiment: "Collaborative / High Volume",
    resolutionTime: "Auto-resolved",
    resolutionProgress: 100,
    keyInsights: [
      "12 unread slack-style messages digested",
      "Figma layout token update finalized",
      "Migration checklist in Zenith repo verified"
    ],
    messages: [
      {
        id: "ds1",
        senderName: "Elena (UX)",
        senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj1o6U8YwryGtzSBTjDWdPybJKCW2CYXhWvZmhmoOxsxxCXnnvTbBjA7L2Q-C9yDINdrZ1uNDUcIaWm4VtX-1AXsiAiUH-uaIy0tad1ezHznztpoRWA-KyaGK5sAwlrRVC65diBq343VM3-oTeYvZrcsNmCmKtR-xm3QDjC3YE-JFE_i83uXkQCJEzWI9RRAKRXFUw3pcFKfbmUkZkcZ00G5C2e8Kvlswk3e-b_53Cv5DVayhMk8_CMQtKo2sL1b9BR0c9w_kQGoY",
        timestamp: "Yesterday 4:32 PM",
        text: "I've pushed the final updates for our iconography grid. We've removed standard double borders."
      },
      {
        id: "ds2",
        senderName: "Kai (Dev)",
        senderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6sEM9X9JGtjeboGNSKRB0sR4Mv65c5jOe4SjAGyKtPERD7ou7er68lHE4BKtdQMdL945tDdPLsrv52RwCZhecWiOJs-hWnO3fkBLxZYxJlsxCTN8iIAMR3Sh_Glc6rmu1RbP0oRDi8rnji4bNDgr-Mn3RDN9bBxZdkBqKUMBH2kYYJhImfbq8WDygh2TfxEhxIs5hw8DzmzxlLRP1uahNr0LDUqs7p2GfW2L5hqLPBGXShzhwVUMmYDXjGvAHAUHqfqgwwa3PkR0",
        timestamp: "Yesterday 5:10 PM",
        text: "Confirmed! Replaced tailwind config values in the visual system. We are good to go."
      }
    ],
    referencedAssets: []
  },
  {
    id: "elena_rostova",
    name: "Elena Rostova",
    role: "Client Relations",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
    lastMessageTime: "Thursday",
    lastMessageText: "Hi there! Just a heads up, the enterprise clients really loved the minimal design of Cognitive Ease. They asked if we could schedule a brief demo session to show how the AI summaries operate under high volume.",
    unread: false,
    priority: "medium",
    aiSummary: "AI: Client scheduling request. High possibility of enterprise contract expansion.",
    status: "Awaiting Scheduling",
    sentiment: "Highly Positive / Opportunity",
    resolutionTime: "Est. 1 day",
    resolutionProgress: 55,
    keyInsights: [
      "Client requested AI product demonstration",
      "Enterprise expansion potential",
      "Preferred platform: Zoom or Meet sync"
    ],
    messages: [
      {
        id: "e1",
        senderName: "Elena Rostova",
        senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
        timestamp: "Thursday 2:15 PM",
        text: "Hi there! Just a heads up, the enterprise clients really loved the minimal design of Cognitive Ease. They asked if we could schedule a brief demo session to show how the AI summaries operate under high volume."
      }
    ],
    referencedAssets: []
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task1",
    text: "Approve Sarah Chen's Q3 budget shift of $12k to influencer campaign",
    priority: "high",
    completed: false,
    dueDate: "5:00 PM Today",
    contactName: "Sarah Chen"
  },
  {
    id: "task2",
    text: "Provide design and layout feedback on Marcus' brand guidelines draft",
    priority: "medium",
    completed: false,
    dueDate: "Tomorrow EOD",
    contactName: "Marcus Aurelius"
  },
  {
    id: "task3",
    text: "Review design sync icon library migration ticket in GitHub",
    priority: "low",
    completed: true,
    dueDate: "Completed",
    contactName: "Design Sync Team"
  },
  {
    id: "task4",
    text: "Schedule product demo slot for Elena's enterprise expansion lead",
    priority: "high",
    completed: false,
    dueDate: "Monday Morning",
    contactName: "Elena Rostova"
  }
];
