import numpy as np, cv2, sys
def enhance(a, vib=0.30, con=0.12, sh=(0.30,0.16), px=1.0):
    lab=cv2.cvtColor(a.astype(np.float32),cv2.COLOR_RGB2Lab)
    L,A,B=lab[...,0],lab[...,1],lab[...,2]
    C=np.sqrt(A*A+B*B); k=1+vib*np.clip(1-C/70,0.15,1)          # vibrance: boost muted colours more
    A*=k; B*=k
    x=L/100; L[:]=100*np.clip(x+con*4*x*(1-x)*(2*x-1),0,1)  # gentle S-curve
    out=cv2.cvtColor(lab,cv2.COLOR_Lab2RGB)
    Y=cv2.cvtColor(out,cv2.COLOR_RGB2Lab)[...,0]/100
    d=sh[0]*(Y-cv2.GaussianBlur(Y,(0,0),px))+sh[1]*(Y-cv2.GaussianBlur(Y,(0,0),px*3.5))
    return np.clip(out+d[...,None],0,1).astype(np.float32)
if __name__=='__main__':
    a=np.load(sys.argv[1]); np.save(sys.argv[2],enhance(a,px=float(sys.argv[3]) if len(sys.argv)>3 else 1.0))
