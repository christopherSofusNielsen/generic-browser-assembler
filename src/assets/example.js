const example = `

mov r0, r1;

#label0
add r0, r1, r2;

sub r1, r2, r3;

and r4, r5, r6;

or r4, r5, r6;

sl r0, r1, 5;

sr r0, r1, 15;

#label1
ld r7, r8;

st r7, r8;

lbi r0, 254;

bze r0, label1;

bnz r0, label2;

bzed r0, -4;

jr r0;

#label2
jri label0;



`;

export default example;
