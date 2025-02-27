import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Main API handler for Vercel serverless functions
 */
interface ResponseData {
  message: string;
  timestamp: number;
  path?: string;
  query?: any;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { method, url, query } = req;
  
  // Create response data
  const responseData: ResponseData = {
    message: `Hello from Vercel Serverless Functions!`,
    timestamp: Date.now(),
    path: url,
    query: query
  };

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Route based on HTTP method
    switch (method) {
      case 'GET':
        return res.status(200).json(responseData);
      
      case 'POST':
        const body = req.body;
        return res.status(201).json({
          ...responseData,
          message: 'Resource created successfully',
          data: body
        });
      
      case 'PUT':
        return res.status(200).json({
          ...responseData,
          message: 'Resource updated successfully'
        });
      
      case 'DELETE':
        return res.status(200).json({
          ...responseData,
          message: 'Resource deleted successfully'
        });
      
      default:
        return res.status(405).json({
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
