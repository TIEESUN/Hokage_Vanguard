---
template: blog-post
title: Rinnegan Awakening Unlocking Kimsuk’s-APT43 Hidden Shadow Network
slug: /rinnegan-awakening-unlocking-kimsuks-apt43-hidden-shadow-network
date: 2024-12-21 22:27
description: APT-43
featuredImage: /assets/rinnegan.webp
researchers:
  - name: Muhammad Sawood
    profileUrl: https://www.linkedin.com/in/muhammadsawood/
---
Alias: Mystery Baby,Baby Coin,Smoke Screen,Black Banshee,Velvet Chollima,Thallium,Emerald Sleet,THALLIUM,Sparkling Pisces

![](/assets/kimkuksky.png)

Kimsuky was first disclosed and named by Kaspersky in 2013, with attack activity dating back as far as 2012. It is believed to have a North Korean national background and has connections with the Group123 APT group. The group's main attack target is South Korea, involving defense, education, energy, government, healthcare, and think tanks, with a focus on classified information theft. 

The U.S. CERT says it has also conducted intelligence gathering attacks on Japan and the United States. The group commonly delivers malware by means of social engineering, Spear phishing emails, and Watering hole attacks, and has a fully functional malicious code arsenal. Kimsuky has been active so far, and has conducted multiple frequent attacks against people in specific fields in Korea and the United States since 2018.

![](/assets/overview.png)

I discovered a domain on Dread, applesec.info, associated with APT43. This domain has been actively used for impersonation, primarily for phishing attacks. By analyzing this domain, I intend to uncover their hidden infrastructure using advanced tactics and techniques inspired by the "**Eyes of the Sage.**"

![](/assets/kimku.png)

To pivot further, we analyzed the domain using VirusTotal to identify interacting IPs and detect malicious patterns.

![](/assets/1-apt43.png)

An IP address, **194.68.27.24**, was found interacting with the domain. Upon deeper inspection, we identified numerous domains associated with malicious activities.

![](/assets/2-apt43.png)

These findings prompted us to examine the IP further across multiple platforms to extract additional intelligence.

![](/assets/3-apt43.png)

Interestingly, the IP lacked an HTTPS service, which raised further interest. Using FOFA, we explored if a web server had been operational previously.

![](/assets/5-apt43.png)

To pivot further, we created a hunt rule to identify infrastructure using the following server header.

**Hunt Rule:** 

```angelscript
Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.2.33 X-Powered-By PHP/7.2.33
```

![](/assets/6-apt43.png)

This rule returned **236 hits**, including several false positives. However, domains with specific TLDs like **.info**, **.cloud**, and **.store** stood out, as these are commonly used by APT43.

![](/assets/7-apt43.png)

In hunting, everyone has different way to move forward. I feel these domains suspicious for 2 reasons. Tld of domains & Korean officials (NTS ). 

**Ntshometax.cloud**

![](/assets/8-apt43.png)

This domain appears clean, but the associated IP showed detections. The impersonation of the Korean National Tax Service (NTS) is evident, aligning with Kimsuky’s known tactics.

 **Ntsguest.cloud**

![](/assets/4-apt43.png)

Shares the same IP address, requiring further analysis.

**156.244.19.38**

![](/assets/12-apt43.png)

Used in phishing campaigns targeting the Korean National Tax Service and other entities.

GOOGLE CLOUD –> **goolgce\[.]cloud** 

![](/assets/14-apt43.png)

Korean Digital Assets Exchange -> **uppbit\[.]cloud**

![](/assets/13-apt43.png)

Mimics the Korean Digital Assets Exchange (Upbit), indicating a focus on victims in the cryptocurrency sector.

**156.244.19.38**

![](/assets/9-apt43.png)

By inspecting the HTTP headers on port 443 and refining the hunt rules, we successfully uncovered six elements of the hidden infrastructure used by the Kimsuky group.

![](/assets/10-apt43.png)

Lets make a hunt rule using header.

**Hunt rule:** 

```asymptote
HTTP/1.1 200 OK  Server: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.2.33 X-Powered-By: PHP/7.2.33 Content-Length: 0 Content-Type: text/html; charset=UTF-8 port:443 ssl:3072
```

![](/assets/11-apt43.png)

And we finally found the infrastructure of Kimsuky, as we can see there are 6 in total. This refined approach eliminated false positives, enabling us to identify the shadow network associated with the APT.

# ***Conclusion:***

The investigation confirms Kimsuky’s strategic use of phishing campaigns and impersonation tactics to exploit South Korean and U.S. entities. Their infrastructure reveals a focus on classified information theft, cryptocurrency exchanges, and governmental impersonations.
By leveraging hunt rules and continuous refinement, we successfully identified critical components of their shadow network. This highlights the importance of structured analysis, leveraging tools like VirusTotal, FOFA, and advanced hunt rules.
The findings underline Kimsuky’s adaptability and persistent threat, reinforcing the need for collaborative intelligence-sharing to counter such APTs effectively.

# ***Diamond Model:***

![](/assets/diamond.png)