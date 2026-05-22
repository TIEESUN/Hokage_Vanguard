---
template: blog-post
title: "The Exploit Theater: Nation-State Cyber Clashes in South Asia"
slug: /the-exploit-theater-nation-state-cyber-clashes-in-south-asia
date: 2025-06-03 10:51
description: The Exploit Theater India Pakistan South Asia Cyberwar Apt-Bitter
  rattle snake sidewinder Asia malware adversary threat intelligence threat
  hunting Mr hamza Side copy transparent tribe Anonsec
featuredImage: /assets/titlee.png
researchers:
  - name: Muhammad Sawood
    profileUrl: https://www.linkedin.com/in/muhammadsawood/
---
# **Executive Summary**

In May 2025, cyberspace emerged as the battleground for a high-stakes digital conflict between India and Pakistan. This report provides a structured threat intelligence analysis of ongoing campaigns conducted by advanced persistent threat (APT) groups aligned with both nations. Pakistan-linked **Transparent Tribe 🇵🇰**, **SideCopy 🇵🇰**, and **RusticWeb 🇵🇰** executed sophisticated espionage and disruption operations targeting Indian infrastructure. Meanwhile, Indian APT groups such as **Donot 🇮🇳**, **SideWinder 🇮🇳**, **Patchwork 🇮🇳**, and **Bitter 🇮🇳** launched precise, stealthy campaigns against Pakistani entities.

The report documents each APT’s TTPs, targeted sectors, indicators of compromise, and shared infrastructure emphasizing how digital borders are being breached through malware, deception, and political motives. The analysis captures payload delivery methods, malware families (Poseidon, Ares, DISGOMOJI), C2 infrastructure, and the increasing fusion of hacktivism with nation-state operations. APT alliances, mirrored techniques, and overlapping infrastructure underscore an evolving doctrine of cyberwar.

- - -



# **1. Introduction**

The digital standoff between India and Pakistan is no longer speculative it is active, aggressive, and evolving. This report investigates cyber operations between regional adversaries with an emphasis on malware campaigns, infrastructure overlaps, and threat actor alliances, all observed in May 2025.

- - -

# **2. Pakistan-Aligned APT Activity**

## **APT Profile: Transparent Tribe (APT36) 🇵🇰**

**TTPs:**

* Spear-phishing, malicious shortcuts, PowerShell/HTA-based droppers
* Transition from Poseidon to Ares modular malware
* Discord-based C2 (DISGOMOJI), obfuscation, LOLBins

**Major Campaigns:**

**•**	**DISGOMOJI:** Golang RAT using emojis via Discord


**•**	**Poseidon:** Linux shortcuts dropping payloads using Google Drive


**•**	**India Post Impersonation Campaign:** Creation of a fraudulent website mimicking the Indian Post Office to distribute malware targeting both Windows and Android users


**•	Malware Embedded in Fake Government Letters:** Distribution of forged government letters embedded with malware, leading to data theft and system compromise	



**Targets:** Indian Ministry of Defense, AIIMS, telecom, shipyards, ports

**Attack Objectives:** Espionage, disruption, psychological ops via hacktivists

**Infrastructure:**

Transparent Tribe (APT-36) exploited trending Indian government-related topics to carry out their attacks. They deployed malware families such as Mythic Leopard and Crimson RAT.

![](/assets/tr1.png)



![](/assets/c2tr.png)



![](/assets/tr7crimson.jpg)





In one of their campaigns, dubbed "Phalgham Terror" APT-36 leveraged geo-political themes in spearphishing attacks. They used domains such as zohidsindia\[.]com, supremecourtofindiagov\[.]com, sync\[.]amsisupport\[.]com, indiandefence\[.]directory, and kashmiraxxack\[.]exposed to deliver Crimson RAT.



![](/assets/tr8phish.jpg)



![](/assets/tr6.png)



![](/assets/tr4.png)



![](/assets/tr5.png)





# **APT-36 Phishing flow:**

![](/assets/tr3phish.png)



- - -



## **APT Profile: SideCopy 🇵🇰**

**TTPs:**

•	Desktop payloads, MSBuild compilation, and delivery of Ares Python RAT
•	HTA evasion tactics and webshell abuse
•	Shared C2 and payloads with Transparent Tribe

**Infrastructure:**

SideCopy, an ally of APT-36, was observed operating active C2 servers to deploy the Python-based Ares RAT.





![](/assets/tr2.png)



- - -



# **3. India-Aligned APT Activity**

**TTPs:**

* Spear-phishing, malicious shortcuts, PowerShell/HTA-based droppers
* Transition from Poseidon to Ares modular malware
* Discord-based C2 (DISGOMOJI), obfuscation, LOLBins

**Major Campaigns:**

**Stealer Bot campaign:** Deployment of a sophisticated espionage toolkit named "StealerBot"

**Confucius Group's Cyber Espionage Activities:** Spear-phishing and social engineering to infiltrate Pakistani government and military

**Asyncshell Deployment:** Deployment of an improved version of the Asyncshell payload

**Targets:** Pakistani government, law enforcement, and nuclear facilities

**Attack Objectives:** Espionage, disruption, psychological ops via hacktivists

**APT: Donot Team 🇮🇳**

* RTF/DOCX decoys, encrypted payloads, scheduled tasks
* May 2025: Fake embassy lures delivering ReverseRAT
* Targeted Pakistani ministries, diplomatic staff

**APT: Patchwork 🇮🇳**

* VBS/Delphi droppers, UN-themed decoys
* Targeted think tanks, policy institutes, telecom

**APT: SideWinder 🇮🇳**

* Android APK lures, mobile RATs (SWamper), HTA-based payloads
* Military and diplomatic espionage via fake alerts

**APT: Bitter 🇮🇳**

* BitterRAT campaigns on telecom & aviation
* Used encrypted HTTP beacons

**Infrastructure:**

During Operation Sindoor, Indian state-sponsored APTs launched targeted attacks against Pakistan's critical infrastructure, focusing on government officials and the armed forces. APT SideWinder deployed a modified Cobalt Strike redirector. HTTP headers from their activity indicated targeting of 'Islamabad Police.' Their infrastructure included domains mimicking official entities, such as **islamabad.net** and **ntservicepack.org**, which were used to deliver trojans.

![](/assets/wind1.png)



Using trending themes to target government officials through a government impersonation campaign.

![](/assets/win.png)



SHA-SAMPLE activity by APT-Bitter using the MS17 exploit

![](/assets/winn.png)



One interesting thing that caught my eye is that APT-Sidewinder is using old infrastructure and attack samples in Operation Sindhoor.

![](/assets/windinfra.jpg)



APT-Patchwork, an Indian APT group, is using Lazarus APT techniques to attack Pakistan. They use methods like fake job invitations, targeting job seekers and remote job opportunities.

![](/assets/wind12.png)



![](/assets/wind11.png)



![](/assets/wind9.png)



![](/assets/wind8.png)



Active C2 “Badur” mentioned in the Pakistan official advisory on ndma-govpk\[.]co.

![](/assets/wind6.png)



Malicious subdomains used by APT-C-17 (Sidewinder)

![](/assets/wind5.png)

It has been observed that the Indian APT group is using the MS-exploit **CVE-2017-0199** to execute malicious arbitrary code.

![](/assets/wind2.png)



- - -

# **4. Digital Crossfire: India–Pakistan APT Operations in 2025**

![](/assets/trvswind.png)



- - -

## **Group Alliance in IND-PAK Cyberwar:**

During the India–Pakistan conflict, several alliances joined Transparent Tribe, driven by the motive to protect the Islamic faith, retaliate, and show the world where they stand.

![](/assets/alliance.jpg)

 **﻿ figure by [Vasilis](https://intelinsights.substack.com/p/profiling-hacktivist-groupsalliances)**



# **5. Technical Indicators (IOCs)**



## **Pakistan APT Hashes & Domains:**



![](/assets/1.png)



## **Indian APT Hashes & Domains:**



![](/assets/2.png)



- - -

# **6. Conclusion**

The cyber conflict between India and Pakistan is unfolding through targeted espionage, data theft, and strategic operations. Pakistani APTs like APT36 and SideCopy, and Indian groups such as Sidewinder and Donot, employ modular malware, mobile surveillance, and stealthy C2s to pursue geopolitical objectives. From DISGOMOJI to BitterRAT, both sides show that cyber tools now rival kinetic ones in impact.