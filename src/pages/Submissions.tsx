import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Home } from 'lucide-react';

const sitesMap = {
  site1: "Authentic Sacrifice",
  site2: "Authority Maximizer",
  site3: "Booked Impact",
  site4: "Live Love Hobby",
  site5: "MDB Consultancy",
  site6: "MDBRAND",
  site7: "New York Post Daily",
  site8: "Seismic Sports",
  site9: "The LA Note",
  site10: "Thought Leaders Ethos",
  site11: "Trending Consumerism",
  site12: "HKlub Fitness"
};

const Submissions = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSubmissions(data || []);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your submissions. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user, navigate, toast]);

  const handleSignOut = async () => {
    try {
      console.log("Submissions: Initiating sign out");
      await signOut();
      // Navigation is handled in the signOut function
    } catch (error) {
      console.error("Submissions: Error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Submissions</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="hover:bg-[#9b87f5] hover:text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button 
            onClick={handleSignOut} 
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't submitted any articles yet.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Selected Sites</TableHead>
              <TableHead>Submitted On</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.title}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${submission.status === 'published' ? 'bg-green-100 text-green-800' :
                    submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {submission.selected_sites?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {submission.selected_sites.map((siteName: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs"
                          >
                            {siteName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No sites selected</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(submission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(submission.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Submissions;
