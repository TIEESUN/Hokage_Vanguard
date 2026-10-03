---
template: blog-post
title: How Hackers Robbed Bitget of $388 Million Without Breaking a Single Lock
slug: how-hackers-robbed-bitget-of-388-million-without-breaking-a-single-lock
date: 2026-10-03 11:37
description: Bitget lost $388M in 2026 without a single private key stolen.
  Inside the transaction spoofing attack that exploited the authorization trust
  gap and drained hot wallets.
researchers:
  - name: Muhammad Sawood
    profileUrl: https://www.linkedin.com/in/muhammadsawood
    photo: /assets/sawood.png
  - name: Sarah Jawaid
    profileUrl: https://www.linkedin.com/in/sarahjawaid/
    photo: /assets/sarah.jpg
---
Imagine a bank heist. In the movies, they drill through vaults, blow up safes, or hold tellers at gunpoint. But what if the world's most successful bank robbery didn't involve a single explosive or a single gun? What if the robbers simply walked into the bank's back office, filled out a perfectly legitimate-looking withdrawal slip, and handed it to a teller who processed it without question?

That is not fiction. That is exactly what happened to Bitget, one of the world's largest cryptocurrency exchanges, on September 24, 2026. In the span of a few hours, attackers drained approximately **$388 million** from the exchange's wallets. But here is the twist. They didn't steal a single private key. They didn't break a single cryptographic lock. They simply lied to the system, and the system believed them.

This is the story of the Bitget hack. How it started, what they did, and how they did it. But to understand the heist, you first need to understand the bank.





**The Three Vaults: Hot, Warm, and Cold Wallets**

A crypto exchange like Bitget does not keep all its money in one place. It uses a three-tier system, each with a different balance of security and convenience.

Think of it like a physical bank. The **hot wallet** is the cash drawer at the teller's counter. It is connected to the internet, so it is fast and easy to access, but it is also the most exposed. Exchanges use hot wallets to handle daily customer withdrawals and deposits. They do not keep the majority of funds there, just enough for everyday liquidity.

The **cold wallet** is the bank's main vault. It is kept offline, disconnected from the internet, in a secure location. You cannot access it remotely. Every time you want to move money from the cold wallet, you need a physical process, multiple approvals, and a lot of time. It is the safest place to store large amounts of cryptocurrency, but it is impractical for daily use.

The **warm wallet** is the middle ground, a secure room inside the bank that requires human intervention to enter. It is more secure than a hot wallet but more accessible than a cold wallet. It is designed for medium-sized transfers that need a bit more oversight than the teller's drawer.

On September 24, the attackers did not touch the cold wallet. The vault was never breached. They targeted the systems that manage the hot and warm wallets, the digital cash drawers and the internal approval process.




![FIGURE 1: The Three-Tier Wallet Architecture](/assets/bitget_fig_1.png "FIGURE 1: The Three-Tier Wallet Architecture")

**The Entry Point: A Flaw in a Third-Party Tool**

The attack did not start with a sophisticated brute-force attack on Bitget's own code. It started with a **zero-day vulnerability** in a third-party security product that Bitget was using. A zero-day is a flaw that the vendor does not know about yet. There is no patch, no fix, no defense. The attackers exploited this flaw to gain **high-level administrative credentials** on Bitget's internal network. They did not need to guess passwords or trick an employee. The vulnerability handed them the keys to the back office.

According to SlowMist's investigation, the attackers were inside Bitget's systems for **25 days** before they struck. The earliest malicious activity was traced to **August 31**, when the attackers ran a hidden script on a compromised server, read an environment variable holding a database password, and connected to the database. The same activity resurfaced on two more nodes on September 23 and September 25, showing the compromised environment predated the theft itself.

This is a crucial detail. The attackers were not rushing. They spent nearly four weeks inside the network, mapping the terrain, identifying the systems they needed, and preparing their tools. They moved with patience, and that patience paid off.




![FIGURE 2: The Initial Access Timeline](/assets/bitget_fig_2.png "FIGURE 2: The Initial Access Timeline")

**The Test Run: The Two Small Transfers**

Before executing the main heist, the attackers did something that every skilled bank robber does. They tested the alarm system.

At **18:31 UTC**, they initiated two very small transfers:

* **0.184 ETH** from an Ethereum hot wallet.
* **193 TRX** from a TRON wallet.

These amounts were deliberately tiny. They fell **below Bitget's risk-control threshold**, meaning no alarms were triggered. The attackers were checking one thing. If we inject a fraudulent command into the system, will it execute without question?

The answer was yes.




![FIGURE 3: The Test Transfer Flow](/assets/bitget_fig_3.png "FIGURE 3: The Test Transfer Flow")

**The Heist: "Transaction Spoofing Payout Order"**

At **17:49 UTC**, the attackers began the main operation. Using an internal employee's identity, they entered the management platform of a second vendor tool and made three straight attempts to inject system commands. They then deployed a **highly customized withdrawal tool**, a piece of software later recovered from files the attacker deleted, that forged risk-control parameters, built withdrawal requests, and triggered the withdrawal process itself.

The first on-chain transfer landed at **18:31 UTC**. The last transfer came roughly **two hours and 52 minutes later**. In total, the attackers executed 17 large transactions across multiple blockchains, including Ethereum, XRP Ledger, Avalanche, BNB Smart Chain, and Arbitrum. XRP made up the single largest piece at about **$153 million**.

But how did they do it? This is where the term **"Transaction Spoofing Payout Order"** comes in. It is a technique we will define here as the core of the attack.

Here is what happened, step by step, in the simplest terms:

1. **They compromised the backend system.** This backend system is the software that prepares the paperwork for every transfer. It tells the authorization system: "The exchange wants to send 10,000 ETH to this address. Please approve it."
2. **They spoofed the transaction data.** Instead of preparing a legitimate transfer, the attackers injected a **fake payout order** directly into the backend system. This order looked completely normal. It had the right format, the right credentials, the right structure. To the authorization system, it looked exactly like a routine payout.
3. **They triggered the authorization process.** The system, seeing what it believed was a legitimate request, approved the transfer. It signed off on the fake payout order without ever questioning whether the request was real.

Bitget's CEO, Gracy Chen, described it perfectly. "The attacker compromised a critical backend system within our wallet infrastructure, used it to spoof transaction data, and triggered our authorization process to move funds out."

She went on to compare it to a bank teller. "The vault keys never left the building. Someone got into the office that prepares the slips, created paperwork that looked official, and sent it through the same approval window the bank uses every day. To the system doing the approving, it looked like a normal payout."

The attackers did not break the lock. They **fooled the person holding the key**.

![FIGURE 4: The Transaction Spoofing Attack, The Authorization Trust Gap](/assets/bitget_fig_4.png "FIGURE 4: The Transaction Spoofing Attack, The Authorization Trust Gap")

**The Attack Vector: A Visual Flow**




![FIGURE 5: Full Attack Chain, From Initial Access to Laundering](/assets/bitget_fig_5.png "FIGURE 5: Full Attack Chain, From Initial Access to Laundering")

**The Getaway: The Laundering Operation**

Stealing the money was only half the job. The attackers now had $388 million in stolen crypto, and they needed to convert it into something usable without getting caught. This is where the operation gets both sophisticated and sloppy.

**The Laundering Pipeline**

The funds were moved through a multi-stage pipeline designed to break the on-chain trail:

1. **THORChain:** The stolen BNB, TRX, and XRP were split into smaller amounts and sent through THORChain, a cross-chain bridge that allows users to swap assets between different blockchains without a centralized exchange. Approximately **90.5% of the stolen XRP** (93.22 million XRP) was exchanged for Bitcoin using THORChain. This is the same route used in the Bybit hack of 2025, where nearly 85% of the stolen funds were converted from ETH to BTC through the same service.
2. **CoW Protocol and Chainflip:** Once the funds were in Bitcoin, the attackers used a second layer of obfuscation. According to SlowMist's TrackAgent tool, North Korean hackers combined **CoW Protocol** (a decentralized exchange aggregator) and **Chainflip** (a cross-chain bridge) to further launder the funds. Automated scripts created orders on CoW Protocol, with the recipient addresses set to pre-prepared Chainflip deposit contracts. Once the orders succeeded, the assets were converted into Bitcoin on Chainflip. One transaction traced by SlowMist showed funds moving from CoW Protocol to a Chainflip deposit contract, ultimately ending up in a Bitcoin address.
3. **Wasabi CoinJoin:** Finally, the Bitcoin was run through **Wasabi**, a privacy tool that uses CoinJoin to mix transactions from multiple users, making it nearly impossible to trace the origin of any specific coin.

**The Sloppy Part: Laundering in Plain Sight**

Blockchain investigator **ZachXBT** revealed that the launderers working for the attackers, likely Chinese-speaking intermediaries, were openly seeking help in **public Discord servers and Telegram channels**. These are not shadowy dark web forums. They are public chat rooms where anyone can see them.

One user, "Cc," complained they sent 277,724 XRP but only 431 was returned. Another, "jack," stated that losing the assets would "cause many problems in his life." This level of carelessness is unusual for a state-sponsored operation.

ZachXBT identified **five aliases** involved in the laundering:




![FIGURE 6: Five launderer aliases linked to the Bitget hack via public Discord and Telegram channels by ZachXBT](/assets/deepseek_mermaid_20261003_8cdffd.png "FIGURE 6: Five launderer aliases linked to the Bitget hack via public Discord and Telegram channels by ZachXBT")

The most significant finding is **Alias 4 ("lolo" / "Marin")**. This individual was also involved in laundering funds from the **$292 million Kelp DAO exploit** earlier in 2026. This is not a coincidence. It indicates that these launderers are not one-off hires but part of a **recurring, professional network** that North Korean hackers use repeatedly.

**The THORChain Controversy**

Bitget CEO Gracy Chen publicly called on THORChain to refuse service to the attacker addresses that had already been flagged across the industry. "Decentralization is a design principle, not a shield to green-light known stolen funds," she said. However, THORChain has continued to process the swaps, earning substantial fees in the process. In the Bybit case alone, THORChain earned an estimated **$5 million to $10 million** in protocol fees from the hacker activity. SlowMist founder Yu Xian (Cos) criticized THORChain's stance, stating that "decentralization should not be an excuse to profit from hacker fees."

![FIGURE 7: The Laundering Pipeline, Following the Money](/assets/bitget_fig_6.png "FIGURE 7: The Laundering Pipeline, Following the Money")

![FIGURE 8: The Launderer Network, Five Aliases, One Recurring Name](/assets/bitget_fig_7.png "FIGURE 8: The Launderer Network, Five Aliases, One Recurring Name")

**The New Threat: JINX-0164**

While the Bitget hack dominates headlines, a new threat actor has been targeting the cryptocurrency industry with a different, equally dangerous approach. In May 2026, Wiz Research identified a previously unreported actor tracked as **JINX-0164**.

JINX-0164 is **financially motivated** and has been active since at least mid-2025. Their methods are distinct from the Bitget attackers, but equally effective:

**1. Social Engineering via LinkedIn:** They create credible LinkedIn profiles and contact developers at crypto organizations, offering virtual meetings. The profiles appear legitimate, with established connections and relevant employment history.

**2. macOS Malware:** The meeting invite links to a malicious domain masquerading as a conferencing platform. Clicking it downloads **AUDIOFIX**, a Python-based macOS infostealer and Remote Access Trojan (RAT) that masquerades as a system audio driver.

**3. Supply Chain Attack:** After stealing credentials from the compromised developer, they move laterally to access internal code distribution systems. They then modify source code to compromise additional endpoints, aiming to steal cryptocurrency wallet credentials.

JINX-0164 represents a different attack surface: the **developer workstation**. While the Bitget attackers targeted the backend infrastructure, JINX-0164 targets the humans who build it. Both are dangerous. Both are effective. And both are part of a broader trend. Attackers are no longer breaking down the door. They are walking in through the front, dressed as trusted colleagues.


<img to be inserted here>\
\
**The Lesson: The Authorization Trust Gap**

The Bitget hack is not a story about stolen keys. It is a story about a **trust gap**. The exchange's authorization system trusted the data it received from its backend system. That trust was the vulnerability.

As one analysis put it: "In this model, attackers do not need keys at all. They compromise the systems that tell the exchange what to sign. If authorization logic trusts backend data more than independent verification, the exchange effectively signs attacker-crafted movements while believing they are legitimate internal transfers."

The defense is **continuous integrity checks** that validate the data itself, independent of the system that supplies it. For critical operations, that means **out-of-band verification**, a separate, trusted channel that confirms what is actually happening, separate from the potentially compromised interface.

The Bybit hack of February 2025 used a similar principle. The AFX hack of July 2025 did too. The Bitget hack of September 2026 is the third in a series. The Lazarus Group has industrialized this technique. Defenders must match that pace.


<img to be inserted here>\
\
**Conclusion**

The Bitget hack is a masterclass in modern cybercrime. It did not rely on brute force or broken cryptography. It relied on **understanding the system's trust assumptions** and exploiting them. The attackers did not pick the lock. They fooled the person holding the key.

For the crypto industry, the lesson is clear. **Never trust, always verify.** The systems that authorize transactions must be independent of the systems that prepare them. The data that drives critical decisions must be validated through multiple channels. And the humans who build and operate these systems must be protected from the social engineering attacks that target them.

The Lazarus Group is patient. They are sophisticated. And they are already planning their next move. The question is, will the industry learn from Bitget before they strike again?
