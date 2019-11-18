# GOSSIP PROTOCOL

## TODO

1. NOTE: BodyPix - start
2. NOTE: Using vagrant or vm, test multiple  comps

## Play Testing

### Prompt

*Welcome to the INTERNET*

*BEINGS on the INTERNET can see you*

*BEINGS on the INTERNET have OPINIONS about you*

*BEINGS OPINIONS about you can and will change*

*BEINGS will express their OPINIONS*

*Create content to keep the BEINGS entertained*

### Instructions

*1) Step into the INTERNET*

*2) OPINIONS can be viewed on the TV*

*3) Keep the BEINGS happy*

### Questions

1) Do you understand what you are supposed to do?

2) Do you know what's going on?

3) How did the overall experience feel?

4) How did seeing yourself on the screens feel?

5) Was anything confusing?

6) Do you feel anything is "missing"?

7) Do you want more to do?

8) Would individual indicators of opinion by each laptop add to the experience?

9) What questions do you have about any part of it?

## Math for Score Algo

[Source of Math](https://sciencing.com/calculate-class-grade-7379797.html)

Example - we are server 4 (of 7):

Score can sum to 100. Five categories comprise the sum, each accounting for 20% of the total. A score above 66.67 is Love. A score below 33.33 is Hate. In the middle is No Opinion.

The following are the given scores provided by each client (before applying bias to self):

1: 25
2: 90
3: 80
4: *68* (self)
5: 46
6: 18
7: 38

1) Using weights below, apply weighting factor

[distance points]
+1: +20
+2: +10
+3: +0

[distance weights]
weight+1: 20 / (20 + 10 + 0) = .667
weight+2: 10 / (20 + 10 + 0) = .333
weight+3: 0 / (20 + 10 + 0) =  0

(each client in the following pairings gets half of its distances weight applied because they in total make up that percentage)

[one away]
3: 80/100 * .335 = .268
5: 56/100 * .335 = .1876

[two away]
2: 90/100 * .165 = .1485
6: 18/100 * .165 = .0297

[three away]
1: 25/100 * 0 = 0
7: 38/100 * 0 = 0

2) Sum results and multiply by 100

sum: .268 + .1876 + .1485 + .0297 + 0 + 0 = .6338

group_weighted_score: .6338 * 100 = *63.38*

3) Using weights below, apply weighting factor to get final score

[a) trust self more]
weight_self = .75
weight_group = .25

self: 68/100 * .75 = .51
group: 63.38/100 * .25 = .15845

sum: .51 + .15845 = .66845

final_weighted_score: .66845 * 100 = *66.85*

[b) trust group and self the same]
weight_self = .50
weight_group = .50

self: 68/100 * .50 = .34
group: 63.38/100 * .50 = .3169

sum: .34 + .3169 = .6569

final_weighted_score: .6569 * 100 = *65.69*

[c) trust group more]
weight_self = .25
weight_group = .75

self: 68/100 * .25 = .17
group: 63.38/100 * .75 = .47535

sum: .17 + .47535 = .64535

final_weighted_score: .64535 * 100 = *64.54*

[d) trust self only]

final_score: *68*

[e) trust group only]

final_score: *63.38*