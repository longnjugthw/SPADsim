//SPAD object
//by Danial Chitnis
//29/07/2019
import { ArrayMaths } from "./arrayMaths";
/**
 * SPAD CLass function
 */
export class SPAD {
    /**
     *
     * @param N the number of datapoints in time
     */
    constructor(N) {
        this.N = N;
        this.Ndelay = 0;
        this.Ntotal = N + this.Ndelay;
        this.t = new ArrayMaths(this.Ntotal);
        this.tr = 0;
        this.timestamps = new ArrayMaths(this.Ntotal);
        this.y = new ArrayMaths(this.Ntotal);
        this.ysq = new ArrayMaths(this.Ntotal);
        this.bw = 0;
        this.t.arange();
        this.timestamps.arange();
        this.y.fill(0);
        this.ysq.fill(0);
    }
    /**
     * SPAD photon gneration based random numbers
     * @param phrate photon rate normlised to 1
     */
    generatePhoton(phrate) {
        const u = new ArrayMaths(phrate * 3);
        u.random();
        u.log();
        u.multiply(-1 / phrate);
        //let tgap=-(1/phrate)*log(u)*T;
        //let tgap = (nj.log(u)).multiply(-1 / phrate);
        u.cumsum();
        this.timestamps = u;
    }
    /**
     * generate the y values based on the recovery time.
     * run generate photon first
     * @param tr the recovery time
     */
    updateY(tr) {
        this.tr = tr;
        const ystep = this.tr;
        let index = 0;
        const y = new ArrayMaths(this.Ntotal);
        y.fill(0);
        const tstep = 1 / this.Ntotal;
        for (let i = 2; i < this.Ntotal; i++) {
            if (i * tstep > this.timestamps.array[index]) {
                //let u = nj.random(1).get(0);
                const u = Math.random();
                if (u > y.array[i - 1]) {
                    y.array[i] = 1;
                }
                else {
                    this.applyYstep(y, i, ystep);
                }
                index = index + 1;
            }
            else {
                this.applyYstep(y, i, ystep);
            }
        }
        this.y = y;
    }
    /**
     * Do the square inverter thresholding
     * @param vthr the voltage threshold value from 0 to 1 range
     */
    updateYsq(vthr) {
        const ysq = new ArrayMaths(this.Ntotal);
        ysq.fill(0);
        for (let i = 0; i < this.Ntotal; i++) {
            if (this.y.array[i] < vthr) {
                ysq.array[i] = 0;
            }
            else {
                ysq.array[i] = 1;
            }
        }
        if (this.bw > 0) {
            this.applyBW(ysq, this.bw);
        }
        this.ysq = ysq;
    }
    applyYstep(y, i, ystep) {
        if (y.array[i - 1] > 0) {
            const a = y.array[i - 1] - ystep;
            y.array[i] = a;
        }
        else {
            y.array[i] = 0;
        }
    }
    truncate(array, n) {
    }
    applyBW(y, bw) {
        //
    }
}
/*function cumsum(array: number[]): number[] {
    let size = array.shape[0];

    let sum = nj.zeros(size);

    sum.set(0, array.get(0));

    for (let i = 1; i < size; i++) {
        let a = sum.get(i - 1) + array.get(i);
        sum.set(i, a);
    }
    return sum;
}*/
//# sourceMappingURL=spad.js.map