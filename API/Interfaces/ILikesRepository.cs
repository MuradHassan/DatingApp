using API.Entites;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<MemberLike?> GetMemberLike(string sourceMemberId, string likedMemberId);
        Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams);
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
        void DeleteLike(MemberLike like);
        void AddLike(MemberLike like);
        Task<bool> SaveAllAsync();
    }
}
