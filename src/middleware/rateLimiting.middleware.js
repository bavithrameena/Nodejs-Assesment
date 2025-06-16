
const MAX_REQUESTS = 5;
const WINDOW_MS = 1000; 

const rateLimits = new Map();

export const rateLimiter = (req, res, next) => {
  const accountToken = req.header('CL-X-TOKEN') || req.ip; 
  const currentTime = Date.now();

  const userData = rateLimits.get(accountToken);

  if (!userData) {
    rateLimits.set(accountToken, { count: 1, startTime: currentTime });
    return next();
  }

  const elapsedTime = currentTime - userData.startTime;

  if (elapsedTime > WINDOW_MS) {
    
    rateLimits.set(accountToken, { count: 1, startTime: currentTime });
    return next();
  }

  if (userData.count >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests from this account. Please wait and try again.',
    });
  }

  userData.count++;
  rateLimits.set(accountToken, userData);
  next();
};
