"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apollo/client";
import { GET_AGENTS } from "@/lib/graphql/queries";
import { User } from "@/lib/graphql/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AgentDetailModal from "./agent-detail-modal";
import Loading from "@/components/loading";

const ITEMS_PER_PAGE = 10;

export default function AgentsList() {
  const [page, setPage] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-agents", page],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_AGENTS,
        variables: {
          page,
          limit: ITEMS_PER_PAGE,
        },
        fetchPolicy: "network-only",
      });
      //@ts-expect-error Object is possibly 'null'.
      return data?.agents || [];
    },
  });

  const agents = data || [];

  const filteredAgents = agents.filter((agent: User) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      agent.fullName?.toLowerCase().includes(query) ||
      agent.email?.toLowerCase().includes(query) ||
      agent.phone?.toLowerCase().includes(query)
    );
  });

  const handleViewAgent = (agent: User) => {
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Error loading agents. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agents Management</h2>
          <p className="text-muted-foreground">
            View and manage agent verifications
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search agents by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredAgents.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No agents found</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredAgents.map((agent: User) => {
              const agentRole = agent.roles?.find((r) => r.role === "agent");
              const isVerified = agentRole?.verified || false;

              return (
                <Card key={agent.userId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {agent.fullName}
                        </h3>
                        <Badge variant={isVerified ? "default" : "secondary"}>
                          {isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>Email: {agent.email}</p>
                        {agent.phone && <p>Phone: {agent.phone}</p>}
                        {agent.address && (
                          <p>
                            Location: {agent.address.city},{" "}
                            {agent.address.country}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleViewAgent(agent)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={filteredAgents.length < ITEMS_PER_PAGE}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onUpdate={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}
