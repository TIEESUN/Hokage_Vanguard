---
template: blog-post
title: CHASING SHADOWS THE HUNT FOR APT BITTER AND ITS HIDDEN INFRASTRUCTURE
slug: /chasing-shadows-the-hunt-for-apt-bitter-and-its-hidden-infrastructure
date: 2024-12-02 14:31
description: Apt-Bitter rattle snake sidewinder Asia malware adversary threat
  intelligence threat hunting
featuredImage: /assets/designer.png
researchers:
  - name: Muhammad Sawood
    profileUrl: https://www.linkedin.com/in/muhammadsawood/
---
**Alias:** Apt-c-08, Apt-k-47, Manlinghua, Turtlepower, NixBackdoor, Nimbo-C2, ORPCBackdoor

![](/assets/1.jpg)

Recently, I discovered that Mysterious Elephant, also known as APT-K-47, operates under the umbrella of APT-C-08, commonly referred to as Bitter, and is targeting South Asian countries, particularly Pakistan & China.

![Apt-bitter](/assets/2.png "APT-BITTER OVERVIEW")

\
The Mysterious Elephant group is well-known for exploiting vulnerabilities in CHM files and documents. In a recent attack on Pakistan and China, they used specific decoy themes, which are as follows.

![bitter](/assets/3.jpg "bitter")

Qi'anxin Threat Intelligence Center and 360 Threat Intelligence Center have revealed a high probability that APT-K-47 is involved in Bitter's campaign. The ORPC Backdoor, associated with the Mysterious Elephant group, along with a recent C# backdoor code used to execute CHM files in the attack, closely resembles malicious samples reported by StrikeReady Labs, which disclosed details of the Bitter group's attack arsenal.\
\
\
I identified a malicious file MD5 hash for one of the group’s decoy themes on Qax, which will assist in tracking their activities and infrastructure.

![](/assets/4.jpg)

To strengthen our assumptions, we conducted a thorough double-check and utilized VirusTotal for verification.

\
\
\
**MITRE ATT&CK™ Matrix (Techniques) Detection**

![](/assets/6.png)

This series of techniques highlights the threat actor's heavy reliance on hooking across multiple phases, showcasing it as a versatile technique for persistence, privilege escalation, and credential access, and complemented by discovery activities to map out the compromised environment.

In order to track the APT Bitter infrastructure, we need to identify the network assets. During our investigation, we discovered something intriguing in the report regarding the APT group's responses.

![](/assets/7.jpg)

\
We used Shodan using my hunt rule and try to find out if we get something interesting but we got
**773** results including so many false positives. 

\
\
**Hunt Rule:**

```apex
HTTP/1.1 403 Forbidden Server: LiteSpeed Content-Length: 1229 port:443
```

![](/assets/8.jpg)

\
We then explored various methods to gather indicators that would allow us to pivot further into their infrastructure. Fortunately, I uncovered valuable information related to APT-Bitter through ‘Mailtrail.’ As a threat researcher, it's essential to stay vigilant and monitor all possible sources. [Mailtrail](https://github.com/stamparm/maltrail/tree/master/trails/static/malware) provided critical malicious indicators that enabled us to effectively pivot and continue hunting the APT-Bitter infrastructure.

![](/assets/9.png)

\
I gathered all the indicators and worked on resolving them. To resolve the indicators, I used an excellent Python-based tool called Domain-Ip, created by [Smackerdodi2](https://github.com/smackerdodi/domain-ip)

![](/assets/10.jpg)

\
\
After resolving the IPs, I proceeded to check their responses, as we know that the APT group's infrastructure typically returns responses such as 403, LiteSpeed, 1229, and 1242. To do this, I used httpx to analyze the responses, which will help guide further investigation.

![](/assets/11.jpg)

\
\
We identified two IPs that returned the same response, as shown in the figure above.
194.36.191.199 & 93.189.61.84.

Let’s verify these IPs using different intelligence tools to determine if they are genuinely malicious or simply false positives.\
\
\
**1) 194.36.191.199**

![](/assets/12.jpg)

\
\
We discovered that a particular domain is malicious, which serves as a valuable pivot point for further investigation. We confirmed that the identified IP is malicious and connects to the domain **‘devflowservice\[.]com.’** Additionally, we now know that the host provider they are using is **Host Sailor Ltd**.

\
\
**2) 93.189.61.84**

![](/assets/13.jpg)

\
\
This IP is clean, indicating a false positive, so we do not need to pivot further on it. We will now focus on the malicious IP and continue our efforts to pivot deeper into the APT group's infrastructure.\
\
\
Let's start by examining the domain we identified as malicious.

![](/assets/14.jpg)

\
**6 flags** from vendors confirm that this domain is associated with two IPs. We’ve now identified another IP, 194.36.191.196, which is flagged as malicious. According to the figure, it appears that the current IP has shifted from 196 to 199. Actors often use such tactics to evade detection and protect their infrastructure.
However, this is just the beginning. As we are hunting a larger APT group from South Asia, we need to act decisively and look for more critical connections. I continued investigating this domain on Threat Book and discovered something often overlooked or dismissed.
As shown in the figure below, both IP addresses (199 and 196) are listed in SPF records. This means the attackers are using these IPs for phishing campaigns. Since they are included in the SPF list, they can bypass SPF checks, resulting in no detection and potentially trapping the target. We can clearly see that both IPs, 196 and 199, are being used for email web trafficking, with 199 also being the current resolver IP address for the domain.

![](/assets/15.png)

\
\
The domain "**devflowservice.com**" appears to be associated with software tools and platforms, specifically targeting developers with solutions for workflow automation and collaboration. One example is an app called "DevFlow," which provides AI-powered code reviews, customizable AI agents, GitHub integration, and other features to assist developers in maintaining code quality and enhancing productivity. Another platform called DevFlow, which is open-source, offers a comprehensive dashboard to streamline project management for software developers. It includes features such as a drag-and-drop workflow designer, real-time notifications, and integrations with various tools like GitHub, Slack, and AWS, making it a collaborative hub for development teams.\
\
\
\
We’ve now connected enough dots regarding the domain, so it’s time to pivot. We have the IP addresses, the response patterns of the assets, and information about the hosting provider.

\
\
**194.36.191.199**

![](/assets/16.jpg)

\
\
Now, we need to open **'VIEWALLDATA'** to check the SSH fingerprint key.

![](/assets/17.png)

\
\
Let’s create a hunt rule to identify SSH clusters using this fingerprint, along with the autonomous system information. Based on our intel, we also know the country with the highest probability of being involved.\

\
**Hunt rule:**

```apex
((services.ssh.server_host_key.fingerprint_sha256="20ac9eeb6288b7a706b9f45a34fc1f89758d2 d9693854bddcc76c44e9d6547df")	and	autonomous_system.name=`HS`)	and location.country=`Netherlands`
```

![](/assets/18.jpg)

\
\
We found 12 results associated with the autonomous system 'Host sailor.' Now, we need to examine these assets to determine if there is any suspicious or malicious activity.

\
**194.36.191.198**

![](/assets/19.png)

\
\
**194.36.191.205**

![](/assets/20.jpg)

\
\
Generic Trojan Detection on IP 194.36.191.205

![](/assets/21.jpg)

\
\
As we can see, this IP is associated with the malware family known as **Generic Trojan**. While examining the IP address 194.36.191.205, I discovered an MD5 hash that piqued my curiosity, prompting me to investigate what lies behind this hash.\
\
\
\
Discovery of ***Glupteba Trojan*** Usage by APT Bitter

![](/assets/22.jpg)

\
We discovered that the APT is most likely using the Glupteba Trojan for data theft and command- and-control (C2) operations.

# Conclusion:

This analysis provides a comprehensive examination of APT-Bitter and its affiliated group, Mysterious Elephant, emphasizing their sophisticated infrastructure and tactics targeting South Asian nations. Through meticulous examination of IP addresses, malware samples, decoy themes, and domain activity, I established connections between malicious entities and confirmed their presence in phishing and command-and-control (C2) operations. The use of services such as Shodan and Mailtrail, combined with domain resolution and response pattern analysis, proved instrumental in mapping these adversaries’ infrastructure. Furthermore, the findings underscore APT-Bitter's tactic of infrastructure rotation to evade detection, evidenced by IP shifts and SPF record manipulation for email-based phishing campaigns. This layered analysis contributes to a clearer understanding of APT-Bitter’s evolving strategies, enhancing defensive measures and informing further investigations. Continued surveillance and adaptation of hunt rules are essential to counter the persistence and complexity of these advanced threat actors.